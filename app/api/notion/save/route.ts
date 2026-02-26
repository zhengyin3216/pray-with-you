import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { saveToNotion } from "@/lib/notion";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  try {
    const { logId, pageId } = await req.json();
    const userId = (session.user as any).id;

    const [user, log] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.prayerLog.findUnique({ where: { id: logId } }),
    ]);

    if (!user?.notionToken) {
      return NextResponse.json({ error: "노션 연동이 필요합니다." }, { status: 400 });
    }
    if (!log) {
      return NextResponse.json({ error: "기도 기록을 찾을 수 없습니다." }, { status: 404 });
    }

    const targetPageId = pageId || user.notionPageId;
    if (!targetPageId) {
      return NextResponse.json({ error: "저장할 노션 페이지를 선택해주세요." }, { status: 400 });
    }

    const notionPageId = await saveToNotion(
      user.notionToken,
      targetPageId,
      log.situation,
      log.prayerType,
      { categories: log.categories as any, scriptures: log.scriptures as any }
    );

    await prisma.prayerLog.update({ where: { id: logId }, data: { notionPageId } });

    if (!user.notionPageId) {
      await prisma.user.update({ where: { id: userId }, data: { notionPageId: targetPageId } });
    }

    return NextResponse.json({
      success: true,
      notionUrl: `https://notion.so/${notionPageId.replace(/-/g, "")}`,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "노션 저장 중 오류가 발생했습니다." }, { status: 500 });
  }
}
