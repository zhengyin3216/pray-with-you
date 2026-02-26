import { Client } from "@notionhq/client";
import { PrayerResult } from "./gemini";

const FULL_ANN = {
  bold: false, italic: false, strikethrough: false,
  underline: false, code: false, color: "default" as const,
};
const BOLD_ANN = { ...FULL_ANN, bold: true };
const ITALIC_ANN = { ...FULL_ANN, italic: true };
const GRAY_ANN = { ...FULL_ANN, color: "gray" as const };

export function getNotionClient(accessToken: string) {
  return new Client({ auth: accessToken });
}

export async function saveToNotion(
  accessToken: string,
  pageId: string,
  situation: string,
  prayerType: string,
  result: PrayerResult
): Promise<string> {
  const notion = getNotionClient(accessToken);
  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric", month: "long", day: "numeric",
  });

  const newPage = await notion.pages.create({
    parent: { page_id: pageId },
    icon: { type: "emoji", emoji: "🙏" },
    properties: {
      title: {
        title: [{ text: { content: `기도 기록 - ${today}` } }],
      },
    },
    children: [
      {
        object: "block", type: "heading_2",
        heading_2: {
          rich_text: [{ type: "text", text: { content: "📌 기도 내용" }, annotations: FULL_ANN }],
          color: "blue_background",
        },
      },
      {
        object: "block", type: "paragraph",
        paragraph: {
          rich_text: [
            { type: "text", text: { content: "현재 상황: " }, annotations: BOLD_ANN },
            { type: "text", text: { content: situation }, annotations: FULL_ANN },
          ],
        },
      },
      {
        object: "block", type: "paragraph",
        paragraph: {
          rich_text: [
            { type: "text", text: { content: "기도 유형: " }, annotations: BOLD_ANN },
            { type: "text", text: { content: prayerType }, annotations: FULL_ANN },
          ],
        },
      },
      {
        object: "block", type: "heading_3",
        heading_3: {
          rich_text: [{ type: "text", text: { content: "함께 드리는 기도" }, annotations: FULL_ANN }],
        },
      },
      ...result.categories.flatMap((cat) => [
        {
          object: "block" as const,
          type: "heading_3" as const,
          heading_3: {
            rich_text: [{ type: "text" as const, text: { content: `함께 드리는 기도 · ${cat.name}` }, annotations: FULL_ANN }],
          },
        },
        ...cat.prayers.map((prayer) => ({
          object: "block" as const,
          type: "bulleted_list_item" as const,
          bulleted_list_item: {
            rich_text: [
              { type: "text" as const, text: { content: `${prayer.title}: ` }, annotations: BOLD_ANN },
              { type: "text" as const, text: { content: prayer.content }, annotations: FULL_ANN },
            ],
          },
        })),
      ]),
      {
        object: "block", type: "paragraph",
        paragraph: { rich_text: [] },
      },
      {
        object: "block", type: "heading_2",
        heading_2: {
          rich_text: [{ type: "text", text: { content: "📌 붙드는 말씀" }, annotations: FULL_ANN }],
          color: "yellow_background",
        },
      },
      ...result.scriptures.flatMap((s) => [
        {
          object: "block" as const, type: "quote" as const,
          quote: {
            rich_text: [
              { type: "text" as const, text: { content: `${s.reference}\n` }, annotations: BOLD_ANN },
              { type: "text" as const, text: { content: s.text }, annotations: FULL_ANN },
            ],
          },
        },
        {
          object: "block" as const, type: "paragraph" as const,
          paragraph: {
            rich_text: [
              { type: "text" as const, text: { content: "✦ " }, annotations: GRAY_ANN },
              { type: "text" as const, text: { content: s.reason }, annotations: ITALIC_ANN },
            ],
          },
        },
      ]),
      {
        object: "block", type: "paragraph",
        paragraph: { rich_text: [] },
      },
      {
        object: "block", type: "heading_2",
        heading_2: {
          rich_text: [{ type: "text", text: { content: "📌 기도하면서 느낀 변화" }, annotations: FULL_ANN }],
          color: "green_background",
        },
      },
      {
        object: "block", type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: [{ type: "text", text: { content: "마음의 변화: " }, annotations: FULL_ANN }],
        },
      },
      {
        object: "block", type: "paragraph",
        paragraph: { rich_text: [] },
      },
      {
        object: "block", type: "heading_2",
        heading_2: {
          rich_text: [{ type: "text", text: { content: "📌 기도 응답" }, annotations: FULL_ANN }],
          color: "pink_background",
        },
      },
      {
        object: "block", type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: [{ type: "text", text: { content: "어떻게 응답되었는가: " }, annotations: FULL_ANN }],
        },
      },
      {
        object: "block", type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: [{ type: "text", text: { content: "하나님이 가르쳐주신 것: " }, annotations: FULL_ANN }],
        },
      },
    ],
  });

  return newPage.id;
}

export function getNotionAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: process.env.NOTION_CLIENT_ID!,
    redirect_uri: process.env.NOTION_REDIRECT_URI!,
    response_type: "code",
    owner: "user",
    state,
  });
  return `https://api.notion.com/v1/oauth/authorize?${params}`;
}

export async function exchangeNotionCode(code: string) {
  const credentials = Buffer.from(
    `${process.env.NOTION_CLIENT_ID}:${process.env.NOTION_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch("https://api.notion.com/v1/oauth/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.NOTION_REDIRECT_URI,
    }),
  });

  if (!res.ok) throw new Error("Notion OAuth 토큰 교환 실패");
  return res.json();
}
