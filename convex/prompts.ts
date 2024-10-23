import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createPrompt = mutation({
  args: {
    question: v.string(),
    answer: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Client is not authenticated!");
    }
    const user = await ctx.db.get(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const promptId = await ctx.db.insert("prompts", {
      userId: user._id,
      question: args.question,
      answer: args.answer,
    });

    return promptId;
  },
});

export const deletePrompt = mutation({
  args: {
    promptId: v.id("prompts"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call to createPrompt");
    }

    await ctx.db.delete(args.promptId);
  },
});

// Updated query to fetch prompts for a user
export const getUserPrompts = query({
  handler: async (ctx) => {
    console.log("server identity", await ctx.auth.getUserIdentity()); // convex logs return null
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Client is not authenticated!");
    }
    const user = await ctx.db.get(userId);

    const prompts = await ctx.db
      .query("prompts")
      .filter((q) => q.eq(q.field("userId"), identity.subject.split("|")[0]))
      .collect();

    return prompts;
  },
});
