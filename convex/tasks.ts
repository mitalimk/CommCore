import {v} from "convex/values";
import {mutation, query} from "./_generated/server";
import {auth} from "./auth";

// Create a new task
export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    workspaceId: v.id("workspaces"),
    channelId: v.optional(v.id("channels")),
    assignedTo: v.optional(v.id("members")),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    dueDate: v.optional(v.number()),
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

    const taskId = await ctx.db.insert("tasks", {
      title: args.title,
      description: args.description,
      workspaceId: args.workspaceId,
      channelId: args.channelId,
      createdBy: member._id,
      assignedTo: args.assignedTo,
      status: "not_started",
      priority: args.priority,
      dueDate: args.dueDate,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return taskId;
  },
});

// Get all tasks for a workspace
export const getByWorkspace = query({
  args: {
    workspaceId: v.id("workspaces"),
    status: v.optional(v.union(
      v.literal("not_started"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("delayed")
    )),
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

    let tasksQuery = ctx.db
      .query("tasks")
      .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.workspaceId));

    const tasks = await tasksQuery.collect();

    // Filter by status if provided
    const filteredTasks = args.status
      ? tasks.filter((task) => task.status === args.status)
      : tasks;

    // Populate creator and assignee info
    const tasksWithMembers = await Promise.all(
      filteredTasks.map(async (task) => {
        const creator = await ctx.db.get(task.createdBy);
        const assignee = task.assignedTo ? await ctx.db.get(task.assignedTo) : null;
        
        const creatorUser = creator ? await ctx.db.get(creator.userId) : null;
        const assigneeUser = assignee ? await ctx.db.get(assignee.userId) : null;

        return {
          ...task,
          creator: creator ? { ...creator, user: creatorUser } : null,
          assignee: assignee ? { ...assignee, user: assigneeUser } : null,
        };
      })
    );

    return tasksWithMembers;
  },
});

// Update task status
export const updateStatus = mutation({
  args: {
    taskId: v.id("tasks"),
    status: v.union(
      v.literal("not_started"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("delayed")
    ),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const task = await ctx.db.get(args.taskId);
    if (!task) throw new Error("Task not found");

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", task.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!member) throw new Error("Unauthorized");

    await ctx.db.patch(args.taskId, {
      status: args.status,
      completedAt: args.status === "completed" ? Date.now() : undefined,
      updatedAt: Date.now(),
    });

    return args.taskId;
  },
});

// Update task details
export const update = mutation({
  args: {
    taskId: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    assignedTo: v.optional(v.id("members")),
    priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
    dueDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const task = await ctx.db.get(args.taskId);
    if (!task) throw new Error("Task not found");

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", task.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!member) throw new Error("Unauthorized");

    const updates: any = { updatedAt: Date.now() };
    if (args.title !== undefined) updates.title = args.title;
    if (args.description !== undefined) updates.description = args.description;
    if (args.assignedTo !== undefined) updates.assignedTo = args.assignedTo;
    if (args.priority !== undefined) updates.priority = args.priority;
    if (args.dueDate !== undefined) updates.dueDate = args.dueDate;

    await ctx.db.patch(args.taskId, updates);
    return args.taskId;
  },
});

// Delete a task
export const remove = mutation({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const task = await ctx.db.get(args.taskId);
    if (!task) throw new Error("Task not found");

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", task.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!member || member.role !== "admin") throw new Error("Unauthorized");

    // Delete task comments
    const comments = await ctx.db
      .query("taskComments")
      .withIndex("by_task_id", (q) => q.eq("taskId", args.taskId))
      .collect();

    for (const comment of comments) {
      await ctx.db.delete(comment._id);
    }

    await ctx.db.delete(args.taskId);
    return args.taskId;
  },
});

// Add comment to task
export const addComment = mutation({
  args: {
    taskId: v.id("tasks"),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const task = await ctx.db.get(args.taskId);
    if (!task) throw new Error("Task not found");

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", task.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!member) throw new Error("Unauthorized");

    const commentId = await ctx.db.insert("taskComments", {
      taskId: args.taskId,
      memberId: member._id,
      body: args.body,
      createdAt: Date.now(),
    });

    return commentId;
  },
});

// Get comments for a task
export const getComments = query({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("taskComments")
      .withIndex("by_task_id", (q) => q.eq("taskId", args.taskId))
      .collect();

    const commentsWithMembers = await Promise.all(
      comments.map(async (comment) => {
        const member = await ctx.db.get(comment.memberId);
        const user = member ? await ctx.db.get(member.userId) : null;
        return {
          ...comment,
          member: member ? { ...member, user } : null,
        };
      })
    );

    return commentsWithMembers;
  },
});
