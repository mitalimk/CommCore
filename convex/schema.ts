import {v} from "convex/values";
import {authTables} from "@convex-dev/auth/server";
import {defineSchema, defineTable} from "convex/server";

const schema = defineSchema({
  ...authTables,
  
  workspaces: defineTable({
    name: v.string(),
    userId: v.id("users"),
    joinCode: v.string(),
  }),
  
  members: defineTable({
    userId: v.id("users"),
    workspaceId: v.id("workspaces"),
    role: v.union(v.literal("admin"), v.literal("member"))
  })
    .index("by_user_id", ["userId"])
    .index("by_workspace_id", ["workspaceId"])
    .index("by_workspace_id_user_id", ["workspaceId", "userId"]),
  
  channels: defineTable({
    name: v.string(),
    workspaceId: v.id("workspaces"),
  })
    .index("by_workspace_id", ["workspaceId"]),
  
  conversations: defineTable({
    workspaceId: v.id("workspaces"),
    memberOneId: v.id("members"),
    memberTwoId: v.id("members"),
  })
    .index("by_workspace_id", ["workspaceId"]),
  
  messages: defineTable({
    body: v.string(),
    image: v.optional(v.id("_storage")),
    memberId: v.id("members"),
    workspaceId: v.id("workspaces"),
    channelId: v.optional(v.id("channels")),
    parentMessageId: v.optional(v.id("messages")),
    conversationId: v.optional(v.id("conversations")),
    updatedAt: v.optional(v.number()),
  })
    .index("by_workspace_id", ["workspaceId"])
    .index("by_member_id", ["memberId"])
    .index("by_channel_id", ["channelId"])
    .index("by_conversation_id", ["conversationId"])
    .index("by_parent_message_id", ["parentMessageId"])
    .index("by_channel_id_parent_message_id_conversation_id", [
      "channelId",
      "parentMessageId",
      "conversationId",
    ]),
  
  reactions: defineTable({
    workspaceId: v.id("workspaces"),
    messageId: v.id("messages"),
    memberId: v.id("members"),
    value: v.string(),
  })
    .index("by_workspace_id", ["workspaceId"])
    .index("by_message_id", ["messageId"])
    .index("by_member_id", ["memberId"]),

  // ==========================================
  // FEATURE 1: TASK MANAGEMENT
  // ==========================================
  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    workspaceId: v.id("workspaces"),
    channelId: v.optional(v.id("channels")),
    createdBy: v.id("members"),
    assignedTo: v.optional(v.id("members")),
    status: v.union(
      v.literal("not_started"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("delayed")
    ),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high")
    ),
    dueDate: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspace_id", ["workspaceId"])
    .index("by_channel_id", ["channelId"])
    .index("by_assigned_to", ["assignedTo"])
    .index("by_created_by", ["createdBy"])
    .index("by_status", ["status"]),

  taskComments: defineTable({
    taskId: v.id("tasks"),
    memberId: v.id("members"),
    body: v.string(),
    createdAt: v.number(),
  })
    .index("by_task_id", ["taskId"]),

  // ==========================================
  // FEATURE 2: KNOWLEDGE HUB
  // ==========================================
  notes: defineTable({
    title: v.string(),
    content: v.string(),
    workspaceId: v.id("workspaces"),
    channelId: v.optional(v.id("channels")),
    createdBy: v.id("members"),
    isPinned: v.boolean(),
    tags: v.array(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspace_id", ["workspaceId"])
    .index("by_channel_id", ["channelId"])
    .index("by_created_by", ["createdBy"]),

  faqs: defineTable({
    question: v.string(),
    answer: v.string(),
    workspaceId: v.id("workspaces"),
    channelId: v.optional(v.id("channels")),
    createdBy: v.id("members"),
    isPinned: v.boolean(),
    upvotes: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspace_id", ["workspaceId"])
    .index("by_channel_id", ["channelId"]),

  documents: defineTable({
    name: v.string(),
    fileId: v.id("_storage"),
    fileType: v.string(),
    fileSize: v.number(),
    workspaceId: v.id("workspaces"),
    channelId: v.optional(v.id("channels")),
    uploadedBy: v.id("members"),
    description: v.optional(v.string()),
    tags: v.array(v.string()),
    createdAt: v.number(),
  })
    .index("by_workspace_id", ["workspaceId"])
    .index("by_channel_id", ["channelId"])
    .index("by_uploaded_by", ["uploadedBy"]),

  // ==========================================
  // FEATURE 3: DISCUSSION ROOMS
  // ==========================================
  discussionRooms: defineTable({
    name: v.string(),
    topic: v.string(),
    description: v.optional(v.string()),
    workspaceId: v.id("workspaces"),
    createdBy: v.id("members"),
    isPrivate: v.boolean(),
    maxMembers: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_workspace_id", ["workspaceId"])
    .index("by_created_by", ["createdBy"]),

  roomMembers: defineTable({
    roomId: v.id("discussionRooms"),
    memberId: v.id("members"),
    role: v.union(v.literal("admin"), v.literal("member")),
    isMuted: v.boolean(),
    joinedAt: v.number(),
  })
    .index("by_room_id", ["roomId"])
    .index("by_member_id", ["memberId"])
    .index("by_room_id_member_id", ["roomId", "memberId"]),

  roomMessages: defineTable({
    roomId: v.id("discussionRooms"),
    memberId: v.id("members"),
    body: v.string(),
    image: v.optional(v.id("_storage")),
    parentMessageId: v.optional(v.id("roomMessages")),
    createdAt: v.number(),
  })
    .index("by_room_id", ["roomId"])
    .index("by_member_id", ["memberId"])
    .index("by_parent_message_id", ["parentMessageId"])
    .index("by_room_id_parent_message_id", ["roomId", "parentMessageId"]),
});

export default schema;
