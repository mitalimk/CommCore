import {v} from "convex/values";
import {mutation, query} from "./_generated/server";
import {auth} from "./auth";

// Create a new note
export const create = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    workspaceId: v.id("workspaces"),
    channelId: v.optional(v.id("channels")),
    tags: v.array(v.string()),
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

    const noteId = await ctx.db.insert("notes", {
      title: args.title,
      content: args.content,
      workspaceId: args.workspaceId,
      channelId: args.channelId,
      createdBy: member._id,
      isPinned: false,
      tags: args.tags,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return noteId;
  },
});

// Get notes by workspace
export const getByWorkspace = query({
  args: {
    workspaceId: v.id("workspaces"),
    channelId: v.optional(v.id("channels")),
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

    const notes = await ctx.db
      .query("notes")
      .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();

    const filteredNotes = args.channelId
      ? notes.filter((note) => note.channelId === args.channelId)
      : notes;

    const notesWithCreator = await Promise.all(
      filteredNotes.map(async (note) => {
        const creator = await ctx.db.get(note.createdBy);
        const user = creator ? await ctx.db.get(creator.userId) : null;
        return {
          ...note,
          creator: creator ? { ...creator, user } : null,
        };
      })
    );

    return notesWithCreator.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.createdAt - a.createdAt;
    });
  },
});

// Update note
export const update = mutation({
  args: {
    noteId: v.id("notes"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const note = await ctx.db.get(args.noteId);
    if (!note) throw new Error("Note not found");

    const updates: any = { updatedAt: Date.now() };
    if (args.title !== undefined) updates.title = args.title;
    if (args.content !== undefined) updates.content = args.content;
    if (args.tags !== undefined) updates.tags = args.tags;

    await ctx.db.patch(args.noteId, updates);
    return args.noteId;
  },
});

// Toggle pin
export const togglePin = mutation({
  args: { noteId: v.id("notes") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const note = await ctx.db.get(args.noteId);
    if (!note) throw new Error("Note not found");

    await ctx.db.patch(args.noteId, {
      isPinned: !note.isPinned,
      updatedAt: Date.now(),
    });

    return args.noteId;
  },
});

// Delete note
export const remove = mutation({
  args: { noteId: v.id("notes") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const note = await ctx.db.get(args.noteId);
    if (!note) throw new Error("Note not found");

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", note.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!member || (note.createdBy !== member._id && member.role !== "admin")) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.noteId);
    return args.noteId;
  },
});
