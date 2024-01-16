import NextAuth from "next-auth";
import type { NextAuthConfig, Profile } from "next-auth";
import type { OIDCConfig, TokenEndpointHandler } from "@auth/core/providers";
import randomstring from "randomstring";

export const config = {
  theme: {
    logo: "https://next-auth.js.org/img/logo/logo-sm.png",
  },
  providers: [
    {
      id: "openpass",
      name: "OpenPass",
      type: "oidc",
      wellKnown: "https://auth.myopenpass.com/.well-known/openid-configuration",
      clientId: process.env.AUTH_OPENPASS_CLIENT_ID,
      clientSecret: process.env.AUTH_OPENPASS_SECRET,
      issuer: "https://auth.myopenpass.com",
      authorization: {
        params: { scope: "openid", state: randomstring.generate() },
      },
    } satisfies OIDCConfig<Profile>,
  ],
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl;
      if (pathname === "/protected") return !!auth;
      return true;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
