import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      subscriptionStatus: true,
      subscriptionEnd: true,
      monthlyUsage: true,
      usageResetDate: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "사용자 없음" }, { status: 404 });
  }

  // 월 사용량 초기화 체크
  const now = new Date();
  const resetDate = new Date(user.usageResetDate);
  if (now.getMonth() !== resetDate.getMonth() || now.getFullYear() !== resetDate.getFullYear()) {
    await prisma.user.update({
      where: { id: userId },
      data: { monthlyUsage: 0, usageResetDate: now },
    });
    user.monthlyUsage = 0;
  }

  // 구독 만료 체크
  if (user.subscriptionStatus === "premium" && user.subscriptionEnd && user.subscriptionEnd < now) {
    await prisma.user.update({
      where: { id: userId },
      data: { subscriptionStatus: "expired" },
    });
    user.subscriptionStatus = "expired";
  }

  const isPremium = user.subscriptionStatus === "premium";
  const FREE_LIMIT = 3;

  return NextResponse.json({
    status: user.subscriptionStatus,
    subscriptionEnd: user.subscriptionEnd,
    monthlyUsage: user.monthlyUsage,
    limit: isPremium ? null : FREE_LIMIT,
    remaining: isPremium ? null : Math.max(0, FREE_LIMIT - user.monthlyUsage),
    canGenerate: isPremium || user.monthlyUsage < FREE_LIMIT,
  });
}
