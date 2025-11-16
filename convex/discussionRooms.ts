import {v} from "convex/values";
import {mutation, query, QueryCtx} from "./_generated/server";
import {auth} from "./auth";
import {Id} from "./_generated/dataModel";

// Helper to populate user data
const populateUser = (ctx: QueryCtx, userId: Id<"users">) => {
  return ctx.db.get(userId);
};

// Create discussion room
export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    workspaceId: v.id("workspaces"),
    topic: v.string(),
    isPrivate: v.boolean(),
    maxMembers: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!member) throw new Error("Member not found");

    const roomId = await ctx.db.insert("discussionRooms", {
      name: args.name,
      description: args.description,
      workspaceId: args.workspaceId,
      topic: args.topic,
      createdBy: member._id,
      isPrivate: args.isPrivate,
      maxMembers: args.maxMembers,
      createdAt: Date.now(),
    });

    // Auto-add creator as moderator
    await ctx.db.insert("roomMembers", {
      roomId,
      memberId: member._id,
      role: "admin",
      isMuted: false,
      joinedAt: Date.now(),
    });

    return roomId;
  },
});

// Get rooms by workspace
export const getByWorkspace = query({
  args: {
    workspaceId: v.id("workspaces"),
    topic: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!member) return [];

    let roomsQuery = ctx.db
      .query("discussionRooms")
      .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.workspaceId));

    const rooms = await roomsQuery.collect();

    const filteredRooms = args.topic
      ? rooms.filter((room) => room.topic === args.topic)
      : rooms;

    // Get room member count and user membership status
    const roomsWithDetails = await Promise.all(
      filteredRooms.map(async (room) => {
        const roomMembers = await ctx.db
          .query("roomMembers")
          .withIndex("by_room_id", (q) => q.eq("roomId", room._id))
          .collect();

        const userMembership = roomMembers.find((rm) => rm.memberId === member._id);

        return {
          ...room,
          memberCount: roomMembers.length,
          isMember: !!userMembership,
          isMuted: userMembership?.isMuted || false,
          userRole: userMembership?.role,
        };
      })
    );

    // Filter private rooms if user is not a member
    return roomsWithDetails.filter((room) => !room.isPrivate || room.isMember);
  },
});

// Join room
export const join = mutation({
  args: { roomId: v.id("discussionRooms") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error("Room not found");

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", room.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!member) throw new Error("Member not found");

    // Check if already a member
    const existing = await ctx.db
      .query("roomMembers")
      .withIndex("by_room_id_member_id", (q) =>
        q.eq("roomId", args.roomId).eq("memberId", member._id)
      )
      .unique();

    if (existing) throw new Error("Already a member");

    // Check max members limit
    if (room.maxMembers) {
      const currentMembers = await ctx.db
        .query("roomMembers")
        .withIndex("by_room_id", (q) => q.eq("roomId", args.roomId))
        .collect();

      if (currentMembers.length >= room.maxMembers) {
        throw new Error("Room is full");
      }
    }

    await ctx.db.insert("roomMembers", {
      roomId: args.roomId,
      memberId: member._id,
   role: "member",

      isMuted: false,
      joinedAt: Date.now(),
    });

    return args.roomId;
  },
});

// Leave room
export const leave = mutation({
  args: { roomId: v.id("discussionRooms") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error("Room not found");

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", room.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!member) throw new Error("Member not found");

    const roomMember = await ctx.db
      .query("roomMembers")
      .withIndex("by_room_id_member_id", (q) =>
        q.eq("roomId", args.roomId).eq("memberId", member._id)
      )
      .unique();

    if (!roomMember) throw new Error("Not a member of this room");

    await ctx.db.delete(roomMember._id);
    return args.roomId;
  },
});

// Toggle mute
export const toggleMute = mutation({
  args: { roomId: v.id("discussionRooms") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error("Room not found");

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", room.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!member) throw new Error("Member not found");

    const roomMember = await ctx.db
      .query("roomMembers")
      .withIndex("by_room_id_member_id", (q) =>
        q.eq("roomId", args.roomId).eq("memberId", member._id)
      )
      .unique();

    if (!roomMember) throw new Error("Not a member of this room");

    await ctx.db.patch(roomMember._id, {
      isMuted: !roomMember.isMuted,
    });

    return args.roomId;
  },
});

// Send message in room
export const sendMessage = mutation({
  args: {
    body: v.string(),
    roomId: v.id("discussionRooms"),
    parentMessageId: v.optional(v.id("roomMessages")),
    image: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error("Room not found");

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", room.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!member) throw new Error("Member not found");

    // Check if user is a member of the room
    const roomMember = await ctx.db
      .query("roomMembers")
      .withIndex("by_room_id_member_id", (q) =>
        q.eq("roomId", args.roomId).eq("memberId", member._id)
      )
      .unique();

    if (!roomMember) throw new Error("Not a member of this room");

    const messageId = await ctx.db.insert("roomMessages", {
      body: args.body,
      roomId: args.roomId,
      memberId: member._id,
      parentMessageId: args.parentMessageId,
      image: args.image,
      createdAt: Date.now()
    });

    return messageId;
  },
});

// Get room messages
export const getMessages = query({
  args: {
    roomId: v.id("discussionRooms"),
    parentMessageId: v.optional(v.id("roomMessages")),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];

    const room = await ctx.db.get(args.roomId);
    if (!room) return [];

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", room.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!member) return [];

    // Check if user is a member of the room
    const roomMember = await ctx.db
      .query("roomMembers")
      .withIndex("by_room_id_member_id", (q) =>
        q.eq("roomId", args.roomId).eq("memberId", member._id)
      )
      .unique();

    if (!roomMember) return [];

    const messages = await ctx.db
      .query("roomMessages")
      .withIndex("by_room_id_parent_message_id", (q) =>
        q.eq("roomId", args.roomId).eq("parentMessageId", args.parentMessageId)
      )
      .collect();

    const messagesWithMembers = await Promise.all(
      messages.map(async (message) => {
        const messageMember = await ctx.db.get(message.memberId);
        const user = messageMember ? await ctx.db.get(messageMember.userId) : null;
        const imageUrl = message.image ? await ctx.storage.getUrl(message.image) : null;

        // Get reply count for threading
        const replies = await ctx.db
          .query("roomMessages")
          .withIndex("by_parent_message_id", (q) =>
            q.eq("parentMessageId", message._id)
          )
          .collect();

        return {
          ...message,
          imageUrl,
          member: messageMember ? { ...messageMember, user } : null,
          replyCount: replies.length,
        };
      })
    );

    return messagesWithMembers.sort((a, b) => a.createdAt - b.createdAt);
  },
});

// Delete room
export const remove = mutation({
  args: { roomId: v.id("discussionRooms") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error("Room not found");

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", room.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!member || member.role !== "admin") throw new Error("Unauthorized");

    // Delete all room members
    const roomMembers = await ctx.db
      .query("roomMembers")
      .withIndex("by_room_id", (q) => q.eq("roomId", args.roomId))
      .collect();

    for (const rm of roomMembers) {
      await ctx.db.delete(rm._id);
    }

    // Delete all messages
    const messages = await ctx.db
      .query("roomMessages")
      .withIndex("by_room_id", (q) => q.eq("roomId", args.roomId))
      .collect();

    for (const msg of messages) {
      await ctx.db.delete(msg._id);
    }

    await ctx.db.delete(args.roomId);
    return args.roomId;
  },
});
