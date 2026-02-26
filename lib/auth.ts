import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "database" },
  pages: {
    signIn: "/",
    error: "/",
  },
  providers: [
    // 카카오
    {
      id: "kakao",
      name: "Kakao",
      type: "oauth",
      authorization: {
        url: "https://kauth.kakao.com/oauth/authorize",
        params: { scope: "profile_nickname profile_image account_email" },
      },
      token: "https://kauth.kakao.com/oauth/token",
      userinfo: "https://kapi.kakao.com/v2/user/me",
      clientId: "7d9e806592174d3d3e93aa86abc07dcb", #process.env.KAKAO_CLIENT_ID,
      clientSecret: "wiO1huSuXSOEFgSV9oUD9rfefwkK75v1", #process.env.KAKAO_CLIENT_SECRET,
      profile(profile: any) {
        return {
          id: String(profile.id),
          name: profile.kakao_account?.profile?.nickname,
          email: profile.kakao_account?.email ?? null,
          image: profile.kakao_account?.profile?.profile_image_url,
        };
      },
    },
    // 네이버
    {
      id: "naver",
      name: "Naver",
      type: "oauth",
      authorization: "https://nid.naver.com/oauth2.0/authorize",
      token: "https://nid.naver.com/oauth2.0/token",
      userinfo: "https://openapi.naver.com/v1/nid/me",
      clientId: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      profile(profile: any) {
        return {
          id: profile.response.id,
          name: profile.response.name,
          email: profile.response.email,
          image: profile.response.profile_image,
        };
      },
    },
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        (session.user as any).id = user.id;
      }
      return session;
    },
  },
};
