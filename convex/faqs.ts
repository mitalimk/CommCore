import {v} from "convex/values";
import {mutation, query} from "./_generated/server";
import {auth} from "./auth";

// Create FAQ
export const create = mutation({
  args: {
    question: v.string(),
    answer: v.string(),
    workspaceId: v.id("workspaces"),
    channelId: v.optional(v.id("channels")),
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

    const faqId = await ctx.db.insert("faqs", {
      question: args.question,
      answer: args.answer,
      workspaceId: args.workspaceId,
      channelId: args.channelId,
      createdBy: member._id,
      isPinned: false,
      upvotes: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return faqId;
  },
});

// Get FAQs
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

    const faqs = await ctx.db
      .query("faqs")
      .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();

    const filteredFaqs = args.channelId
      ? faqs.filter((faq) => faq.channelId === args.channelId)
      : faqs;

    const faqsWithCreator = await Promise.all(
      filteredFaqs.map(async (faq) => {
        const creator = await ctx.db.get(faq.createdBy);
        const user = creator ? await ctx.db.get(creator.userId) : null;
        return {
          ...faq,
          creator: creator ? { ...creator, user } : null,
        };
      })
    );

    return faqsWithCreator.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.upvotes - a.upvotes;
    });
  },
});

// Update FAQ
export const update = mutation({
  args: {
    faqId: v.id("faqs"),
    question: v.optional(v.string()),
    answer: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const faq = await ctx.db.get(args.faqId);
    if (!faq) throw new Error("FAQ not found");

    const updates: any = { updatedAt: Date.now() };
    if (args.question !== undefined) updates.question = args.question;
    if (args.answer !== undefined) updates.answer = args.answer;

    await ctx.db.patch(args.faqId, updates);
    return args.faqId;
  },
});

// Toggle pin
export const togglePin = mutation({
  args: { faqId: v.id("faqs") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const faq = await ctx.db.get(args.faqId);
    if (!faq) throw new Error("FAQ not found");

    await ctx.db.patch(args.faqId, {
      isPinned: !faq.isPinned,
      updatedAt: Date.now(),
    });

    return args.faqId;
  },
});

// Upvote FAQ
export const upvote = mutation({
  args: { faqId: v.id("faqs") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const faq = await ctx.db.get(args.faqId);
    if (!faq) throw new Error("FAQ not found");

    await ctx.db.patch(args.faqId, {
      upvotes: faq.upvotes + 1,
      updatedAt: Date.now(),
    });

    return args.faqId;
  },
});

// Delete FAQ
export const remove = mutation({
  args: { faqId: v.id("faqs") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const faq = await ctx.db.get(args.faqId);
    if (!faq) throw new Error("FAQ not found");

    await ctx.db.delete(args.faqId);
    return args.faqId;
  },
});
