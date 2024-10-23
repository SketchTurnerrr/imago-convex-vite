import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const sendMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Client is not authenticated!");
    }

    const profile = await ctx.db
      .query("users")
      .withIndex("by_id", (q) => q.eq("_id", userId))
      .first();

    if (!profile) throw new Error("Profile not found");

    const message = await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      senderId: profile._id,
      content: args.content,
    });

    // Update the conversation's lastMessageTime
    await ctx.db.patch(args.conversationId, {
      lastMessageTime: Date.now(),
    });

    return message;
  },
});

// export const send = mutation({
//   args: { body: v.string() },
//   handler: async (ctx, { body }) => {
//     const userId = await getAuthUserId(ctx);
//     if (userId === null) {
//       throw new Error("Not signed in");
//     }
//     // Send a new message.
//     await ctx.db.insert("messages", { body, userId });
//   },
// });
