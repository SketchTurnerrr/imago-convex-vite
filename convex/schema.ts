import { authTables } from '@convex-dev/auth/server';
import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema(
  {
    ...authTables,
    users: defineTable({
      name: v.optional(v.string()),
      image: v.optional(v.string()),
      email: v.optional(v.string()),
      emailVerificationTime: v.optional(v.number()),
      phone: v.optional(v.string()),
      phoneVerificationTime: v.optional(v.number()),
      isAnonymous: v.optional(v.boolean()),
      // my fields
      dob: v.optional(v.string()),
      gender: v.optional(v.string()),
      denomination: v.optional(v.string()),
      location: v.optional(v.string()),
      custom_location: v.optional(v.string()),
      random: v.optional(v.float64()),
      onboarded: v.optional(v.boolean()),
      verified: v.optional(v.boolean()),
    })
      .index('by_rand', ['random'])
      .index('email', ['email']),

    prompts: defineTable({
      question: v.string(),
      answer: v.string(),
      userId: v.id('users'),
    }).index('by_userId', ['userId']),

    photos: defineTable({
      userId: v.id('users'),
      url: v.string(),
      order: v.number(), // To maintain the order of photos
    }).index('by_userId', ['userId']),

    likes: defineTable({
      likerId: v.id('users'),
      likedUserId: v.id('users'),
      itemId: v.union(v.id('photos'), v.id('prompts')),
      itemType: v.union(v.literal('photo'), v.literal('prompt')),
      comment: v.optional(v.string()),
    })
      .index('by_liker', ['likerId'])
      .index('by_liked_user', ['likedUserId'])
      .index('by_item', ['itemId'])
      .index('by_liker_and_item', ['likerId', 'itemId']),

    matches: defineTable({
      initiatorId: v.id('users'),
      receiverId: v.id('users'),
      likeId: v.id('likes'),
      comment: v.optional(v.string()),
      status: v.string(), // 'pending', 'accepted', 'rejected'
    })
      .index('by_initiator', ['initiatorId'])
      .index('by_receiver', ['receiverId'])
      .index('by_like', ['likeId']),

    conversations: defineTable({
      participantIds: v.array(v.id('users')),
      lastMessageTime: v.number(),
    }).index('by_participants', ['participantIds']),

    messages: defineTable({
      conversationId: v.id('conversations'),
      senderId: v.id('users'),
      content: v.string(),
    }).index('by_conversation', ['conversationId']),
  },
  // If you ever get an error about schema mismatch
  // between your data and your schema, and you cannot
  // change the schema to match the current data in your database,
  // you can:
  //  1. Use the dashboard to delete tables or individual documents
  //     that are causing the error.
  //  2. Change this option to `false` and make changes to the data
  //     freely, ignoring the schema. Don't forget to change back to `true`!
  { schemaValidation: true }
);
