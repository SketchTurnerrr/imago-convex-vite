import { ConvexError, v } from 'convex/values';
import { query, mutation, action } from './_generated/server';
import { api } from './_generated/api';
import { Id } from './_generated/dataModel';
import { getAuthUserId } from '@convex-dev/auth/server';

export const getRandomProfile = query({
  args: { key: v.optional(v.number()) },
  handler: async (ctx) => {
    const generated = Math.random();

    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error('Client is not authenticated!');
    }
    const user = await ctx.db.get(userId);

    if (!user) {
      throw new Error('User not found');
    }

    const currentUserProfile = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('_id'), user._id))
      .first();

    // const allProfiles = await ctx.db
    //   .query('profiles')
    //   .filter((q) => q.neq(q.field('_id'), currentUserProfile._id))
    //   .collect();
    // console.log('allProfiles :', allProfiles);

    // if (allProfiles.length === 0) return null;
    const opositeGender =
      currentUserProfile?.gender === 'male' ? 'female' : 'male';

    let next = await ctx.db
      .query('users')
      .withIndex('by_rand', (q) => q.gte('random', generated))
      .filter((q) =>
        q.and(
          q.eq(q.field('gender'), opositeGender),
          q.eq(q.field('onboarded'), true)
        )
      )
      .first();

    if (next === null) {
      next = await ctx.db
        .query('users')
        .withIndex('by_rand', (q) => q.lt('random', generated))
        .filter((q) =>
          q.and(
            q.eq(q.field('gender'), opositeGender),
            q.eq(q.field('onboarded'), true)
          )
        )
        .first();
      if (next === null) {
        throw new ConvexError("Can't get a random record from an empty table");
      }
    }

    // Fetch photos for the random profile
    const photos = await ctx.db
      .query('photos')
      .filter((q) => q.eq(q.field('userId'), next._id))
      .collect();

    // Fetch prompts for the random profile
    const prompts = await ctx.db
      .query('prompts')
      .filter((q) => q.eq(q.field('userId'), next._id))
      .collect();

    return {
      ...next,

      photos,
      prompts,
    };
  },
});

export const getProfileById = query({
  args: { id: v.optional(v.id('users')) },
  handler: async (ctx, args) => {
    if (!args.id) return null;
    const profile = await ctx.db.get(args.id);
    if (!profile) return null;

    const photos = await ctx.db
      .query('photos')
      .filter((q) => q.eq(q.field('userId'), profile._id))
      .collect();

    const prompts = await ctx.db
      .query('prompts')
      .filter((q) => q.eq(q.field('userId'), profile._id))
      .collect();

    return {
      ...profile,
      photos,
      prompts,
    };
  },
});
