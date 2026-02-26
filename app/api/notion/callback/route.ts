import { NextRequest, NextResponse } from "next/server";
import { exchangeNotionCode } from "@/lib/notion";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error || !code || !state) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard?notion=error`);
  }

  try {
    const tokenData = await exchangeNotionCode(code);
    await prisma.user.update({
      where: { id: state },
      data: { notionToken: tokenData.access_token },
    });
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/connect-notion`
    );
  } catch (e) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard?notion=error`);
  }
}
