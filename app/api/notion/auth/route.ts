import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getNotionAuthUrl } from "@/lib/notion";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }
  const state = (session.user as any).id;
  const url = getNotionAuthUrl(state);
  return NextResponse.redirect(url);
}
