import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getNotionClient } from "@/lib/notion";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
  });

  if (!user?.notionToken) {
    return NextResponse.json({ pages: [], connected: false });
  }

  try {
    const notion = getNotionClient(user.notionToken);
    const response = await notion.search({
      filter: { value: "page", property: "object" },
      sort: { direction: "descending", timestamp: "last_edited_time" },
      page_size: 20,
    });

    const pages = response.results
      .filter((p: any) => p.object === "page")
      .map((p: any) => ({
        id: p.id,
        title:
          p.properties?.title?.title?.[0]?.plain_text ||
          p.properties?.Name?.title?.[0]?.plain_text ||
          "제목 없음",
      }));

    return NextResponse.json({ pages, connected: true, defaultPageId: user.notionPageId });
  } catch {
    return NextResponse.json({ pages: [], connected: false });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }
  const { pageId } = await req.json();
  await prisma.user.update({
    where: { id: (session.user as any).id },
    data: { notionPageId: pageId },
  });
  return NextResponse.json({ success: true });
}
