import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY!;
const TOSS_API_BASE = "https://api.tosspayments.com";

// 토스페이먼츠 빌링키 발급 (카드 등록 + 첫 결제)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
  }

  const { authKey, customerKey } = await req.json();
  const userId = (session.user as any).id;

  try {
    const encoded = Buffer.from(`${TOSS_SECRET_KEY}:`).toString("base64");

    // 1단계: 빌링키 발급
    const billingRes = await fetch(`${TOSS_API_BASE}/v1/billing/authorizations/issue`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${encoded}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ authKey, customerKey }),
    });

    const billingData = await billingRes.json();
    if (!billingRes.ok) {
      throw new Error(billingData.message || "빌링키 발급 실패");
    }

    const billingKey = billingData.billingKey;
    const orderId = `pray-${userId}-${Date.now()}`;
    const orderName = "함께기도해 프리미엄 구독";
    const amount = 9900;

    // 2단계: 첫 번째 자동결제
    const payRes = await fetch(`${TOSS_API_BASE}/v1/billing/${billingKey}`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${encoded}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerKey,
        amount,
        orderId,
        orderName,
        customerEmail: session.user.email,
        customerName: session.user.name,
      }),
    });

    const payData = await payRes.json();
    if (!payRes.ok) {
      throw new Error(payData.message || "결제 실패");
    }

    // 3단계: DB 업데이트
    const now = new Date();
    const endDate = new Date(now);
    endDate.setMonth(endDate.getMonth() + 1);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: {
          subscriptionStatus: "premium",
          subscriptionEnd: endDate,
          billingKey,
        },
      }),
      prisma.subscription.create({
        data: {
          userId,
          plan: "premium",
          status: "active",
          amount,
          startDate: now,
          endDate,
          tossOrderId: orderId,
          tossPaymentKey: payData.paymentKey,
          billingKey,
        },
      }),
    ]);

    return NextResponse.json({ success: true, paymentKey: payData.paymentKey });
  } catch (error: any) {
    console.error("Toss payment error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
