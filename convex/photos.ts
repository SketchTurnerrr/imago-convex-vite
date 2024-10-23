import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getAuthUserId } from '@convex-dev/auth/server';

export const getUserPhotos = query({
  args: { single: v.boolean() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error('Client is not authenticated!');
    }
    const user = await ctx.db.get(userId);

    if (!user) {
      throw new Error('User not found');
    }

    if (args.single) {
      return ctx.db
        .query('photos')
        .filter((q) => q.eq(q.field('userId'), user._id))
        .first();
    } else {
      return ctx.db
        .query('photos')
        .filter((q) => q.eq(q.field('userId'), user._id))
        .collect();
    }
  },
});

export const addPhoto = mutation({
  args: { url: v.string(), order: v.number() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error('Not signed in');
    }
    const user = await ctx.db.get(userId);
    if (user === null) {
      throw new Error('User was deleted');
    }

    if (!user) {
      throw new Error('User not found');
    }

    return ctx.db.insert('photos', {
      userId: user._id,
      url: args.url,
      order: args.order,
    });
  },
});

export const removePhoto = mutation({
  args: { id: v.id('photos') },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error('Client is not authenticated!');
    }
    const user = await ctx.db.get(userId);

    if (!user) {
      throw new Error('User not found');
    }
    const photo = await ctx.db.get(args.id);
    if (!photo) throw new Error('Photo not found');

    // Extract the fileKey from the URL
    const fileKey = photo.url.split('/').pop();
    if (!fileKey) throw new Error('Invalid fileKey');

    // Call the mutation to delete the file from UploadThing

    // Delete the photo from the database
    await ctx.db.delete(args.id);
  },
});

// export const deleteFromUploadThing = action({
//   args: { fileKey: v.string() },
//   handler: async (ctx, args) => {
//     ctx.runAction;
//     const result = await fetch(`http://localhost:3000/api/uploadthing/delete`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },

//       body: JSON.stringify({ fileKey: args.fileKey }),
//     });
//     console.log('result :', result);

//     if (!result.ok) {
//       throw new Error('Failed to delete file from UploadThing');
//     }
//   },
// });

export const updatePhotoOrder = mutation({
  args: {
    newOrder: v.array(v.object({ id: v.id('photos'), order: v.number() })),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error('Client is not authenticated!');
    }
    const user = await ctx.db.get(userId);

    if (!user) {
      throw new Error('User not found');
    }

    for (const { id, order } of args.newOrder) {
      await ctx.db.patch(id, { order });
    }
  },
});
