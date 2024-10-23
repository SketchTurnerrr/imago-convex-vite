import Google from "@auth/core/providers/google";
import Resend from "@auth/core/providers/resend";
import { convexAuth } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [
    Google,

    Resend({
      apiKey: process.env.AUTH_RESEND_KEY,
      from: process.env.AUTH_EMAIL ?? "My App <onboarding@resend.dev>",
    }),
  ],
});
