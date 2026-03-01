import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import KakaoProvider from "next-auth/providers/kakao";
import NaverProvider from "next-auth/providers/naver";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  // ✅ 수정: "database" → "jwt" 로 변경
  // database 전략은 DB 연결 실패 시 세션이 저장되지 않아 로그인 후에도 첫 화면에 머무르는 버그 발생
  session: { strategy: "jwt" },
  pages: {
    signIn: "/",
    error: "/",
  },
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID!,
      clientSecret: process.env.NAVER_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // 최초 로그인 시 user 정보를 token에 저장
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
        // 구독 정보 로드
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { subscriptionStatus: true, subscriptionEnd: true },
        });
        token.subscriptionStatus = dbUser?.subscriptionStatus ?? "free";
        token.subscriptionEnd = dbUser?.subscriptionEnd ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        (session.user as any).id = token.id as string;
        (session.user as any).subscriptionStatus = token.subscriptionStatus;
        (session.user as any).subscriptionEnd = token.subscriptionEnd;
      }
      return session;
    },
  },
};
