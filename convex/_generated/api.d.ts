/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as conversations from "../conversations.js";
import type * as helpers from "../helpers.js";
import type * as http from "../http.js";
import type * as likes from "../likes.js";
import type * as matches from "../matches.js";
import type * as messages from "../messages.js";
import type * as photos from "../photos.js";
import type * as profiles from "../profiles.js";
import type * as prompts from "../prompts.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  conversations: typeof conversations;
  helpers: typeof helpers;
  http: typeof http;
  likes: typeof likes;
  matches: typeof matches;
  messages: typeof messages;
  photos: typeof photos;
  profiles: typeof profiles;
  prompts: typeof prompts;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
