import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// 구독 해지 (다음 결제 중지, 현재 기간은 유지)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
  }

  const userId = (session.user as any).id;

  await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionStatus: "cancelled",
      billingKey: null, // 빌링키 삭제로 자동결제 중지
    },
  });

  await prisma.subscription.updateMany({
    where: { userId, status: "active" },
    data: { status: "cancelled" },
  });

  return NextResponse.json({ success: true });
}
