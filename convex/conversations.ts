import { query } from './_generated/server';
import { v } from 'convex/values';
import { filter } from 'convex-helpers/server/filter';
import { getAuthUserId } from '@convex-dev/auth/server';

export const getUserConversations = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error('Client is not authenticated!');
    }
    const user = await ctx.db.get(userId);

    if (!user) {
      throw new Error('User not found');
    }

    const profile = await ctx.db
      .query('users')
      .withIndex('by_id', (q) => q.eq('_id', user._id))
      .first();

    if (!profile) throw new Error('Profile not found');

    const conversations = await filter(
      ctx.db.query('conversations'),

      (q) => q.participantIds.includes(profile._id)
    ).collect();

    const conversationsWithDetails = await Promise.all(
      conversations.map(async (conversation) => {
        const otherParticipantId = conversation.participantIds.find(
          (id) => id !== profile._id
        );

        if (!otherParticipantId) {
          return null;
        }
        const otherParticipant = await ctx.db.get(otherParticipantId);

        if (!otherParticipant) {
          return null;
        }
        const otherParticipantPhoto = await ctx.db
          .query('photos')
          .filter((q) => q.eq(q.field('userId'), otherParticipant._id))
          .first();

        const lastMessage = await ctx.db
          .query('messages')
          .withIndex('by_conversation', (q) =>
            q.eq('conversationId', conversation._id)
          )
          .order('desc')
          .first();

        return {
          ...conversation,
          otherParticipant,
          otherParticipantPhoto,
          lastMessage,
        };
      })
    );

    return conversationsWithDetails;
  },
});

export const getConversationById = query({
  args: { id: v.id('conversations') },
  handler: async (ctx, args) => {
    const conversation = await ctx.db.get(args.id);
    if (!conversation) throw new Error('Conversation not found');

    const messages = await ctx.db
      .query('messages')
      .withIndex('by_conversation', (q) => q.eq('conversationId', args.id))

      .collect();

    const participantDetails = await Promise.all(
      conversation.participantIds.map(async (id) => {
        const profile = await ctx.db.get(id);
        const photos = await ctx.db
          .query('photos')
          .filter((q) => q.eq(q.field('userId'), id))
          .collect();
        const prompts = await ctx.db
          .query('prompts')
          .filter((q) => q.eq(q.field('userId'), id))
          .collect();

        return { ...profile, photos, prompts };
      })
    );

    return { ...conversation, messages, participantDetails };
  },
});
