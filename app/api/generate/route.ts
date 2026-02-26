import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generatePrayer } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  try {
    const { situation, prayerType } = await req.json();
    if (!situation?.trim()) {
      return NextResponse.json({ error: "상황을 입력해주세요." }, { status: 400 });
    }

    const result = await generatePrayer(situation, prayerType || "간구");

    const log = await prisma.prayerLog.create({
      data: {
        userId: (session.user as any).id,
        situation,
        prayerType: prayerType || "간구",
        categories: result.categories as any,
        scriptures: result.scriptures as any,
      },
    });

    return NextResponse.json({ success: true, logId: log.id, result });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "생성 중 오류가 발생했습니다." }, { status: 500 });
  }
}
