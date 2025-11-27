import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import Credentials from "@auth/core/providers/credentials";

import { convexAuth } from "@convex-dev/server/auth";
import { Password } from "@convex-dev/auth/providers/password";

import { DataModel } from "./_generated/dataModel";

export const { auth, signIn, signOut, store, isAuthenticated } =
  convexAuth<DataModel>({
    providers: {
      credentials: Credentials({
        authorize: async (params) => {
          return {
            email: params.email as string,
            name: params.name as string,
          };
        }
      }),
      github: GitHub({
        clientId: process.env.AUTH_GITHUB_ID!,
        clientSecret: process.env.AUTH_GITHUB_SECRET!,
      }),
      google: Google({
        clientId: process.env.AUTH_GOOGLE_ID!,
        clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      })
    }
  });