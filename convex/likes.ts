import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

import { asyncMap } from 'convex-helpers';
import { getAuthUserId } from '@convex-dev/auth/server';

export const addLike = mutation({
  args: {
    likerId: v.id('users'),
    likedUserId: v.id('users'),
    itemId: v.union(v.id('photos'), v.id('prompts')),
    itemType: v.union(v.literal('photo'), v.literal('prompt')),
  },
  handler: async (ctx, args) => {
    const { likerId, likedUserId, itemId, itemType } = args;
    ``;

    // Fetch liker's information
    const liker = await ctx.db.get(likerId);
    if (!liker) throw new Error('Liker not found');

    return await ctx.db.insert('likes', {
      likerId,
      likedUserId,
      itemId,
      itemType,
    });
  },
});

export const removeLike = mutation({
  args: {
    likerId: v.id('users'),
    itemId: v.union(v.id('photos'), v.id('prompts')),
  },
  handler: async (ctx, args) => {
    const { likerId, itemId } = args;
    const like = await ctx.db
      .query('likes')
      .withIndex('by_liker_and_item', (q) =>
        q.eq('likerId', likerId).eq('itemId', itemId)
      )
      .first();
    if (like) {
      await ctx.db.delete(like._id);
    }
  },
});

export const getLikesForUser = query({
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

    if (!profile) {
      throw new Error('Unauthenticated');
    }

    const likes = await ctx.db
      .query('likes')
      .withIndex('by_liked_user', (q) => q.eq('likedUserId', profile?._id))
      .order('desc')
      .collect();

    const likesWithDetails = await asyncMap(likes, async (like) => {
      const liker = await ctx.db.get(like.likerId);

      if (!liker) throw new Error('Liker not found');

      const likerPhoto = await ctx.db
        .query('photos')
        .withIndex('by_userId', (q) => q.eq('userId', liker._id))
        .first();

      let item;

      if (like.itemType === 'photo') {
        item = await ctx.db.get(like.itemId);
      } else if (like.itemType === 'prompt') {
        item = await ctx.db.get(like.itemId);
      }
      return {
        ...like,
        liker,
        likerPhoto,
        item,
      };
    });

    return likesWithDetails;
  },
});

export const getLikeById = query({
  args: {
    likeId: v.id('likes'),
  },
  handler: async (ctx, args) => {
    const { likeId } = args;

    const like = await ctx.db.get(likeId);
    if (!like) {
      return null; // Or throw an error if you prefer
    }

    const liker = await ctx.db.get(like.likerId);
    const likedProfile = await ctx.db.get(like.likedUserId);

    let item;
    if (like.itemType === 'photo') {
      item = await ctx.db.get(like.itemId);
    } else if (like.itemType === 'prompt') {
      item = await ctx.db.get(like.itemId);
    }

    // Fetch the first photo of the liker for their profile picture
    const likerPhoto = await ctx.db
      .query('photos')
      .withIndex('by_userId', (q) => q.eq('userId', like.likedUserId))
      .first();

    return {
      ...like,
      liker: {
        ...liker,
        profilePicture: likerPhoto?.url,
      },
      likedProfile,
      item,
    };
  },
});
