import {v} from "convex/values";
import {mutation, query} from "./_generated/server";
import {auth} from "./auth";

// Upload document metadata
export const create = mutation({
  args: {
    name: v.string(),
    fileId: v.id("_storage"),
    fileType: v.string(),
    fileSize: v.number(),
    workspaceId: v.id("workspaces"),
    channelId: v.optional(v.id("channels")),
    description: v.optional(v.string()),
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

    const docId = await ctx.db.insert("documents", {
      name: args.name,
      fileId: args.fileId,
      fileType: args.fileType,
      fileSize: args.fileSize,
      workspaceId: args.workspaceId,
      channelId: args.channelId,
      uploadedBy: member._id,
      description: args.description,
      tags: args.tags,
      createdAt: Date.now(),
    });

    return docId;
  },
});

// Get documents
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

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();

    const filteredDocs = args.channelId
      ? documents.filter((doc) => doc.channelId === args.channelId)
      : documents;

    const docsWithUploader = await Promise.all(
      filteredDocs.map(async (doc) => {
        const uploader = await ctx.db.get(doc.uploadedBy);
        const user = uploader ? await ctx.db.get(uploader.userId) : null;
        const url = await ctx.storage.getUrl(doc.fileId);
        return {
          ...doc,
          url,
          uploader: uploader ? { ...uploader, user } : null,
        };
      })
    );

    return docsWithUploader.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Delete document
export const remove = mutation({
  args: { docId: v.id("documents") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const doc = await ctx.db.get(args.docId);
    if (!doc) throw new Error("Document not found");

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", doc.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!member || (doc.uploadedBy !== member._id && member.role !== "admin")) {
      throw new Error("Unauthorized");
    }

    await ctx.storage.delete(doc.fileId);
    await ctx.db.delete(args.docId);
    return args.docId;
  },
});
