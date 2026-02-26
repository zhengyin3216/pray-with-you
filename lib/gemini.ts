import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface PrayerResult {
  prayers: { title: string; content: string }[];
  scriptures: { reference: string; text: string; reason: string }[];
}

export async function generatePrayer(
  situation: string,
  prayerType: string
): Promise<PrayerResult> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
당신은 성경적 기도를 도와주는 조력자입니다.
사용자의 현재 상황을 듣고, 하나님께 구체적으로 기도할 내용과 붙들 말씀을 제안해주세요.

[현재 상황]
${situation}

[기도 유형]
${prayerType}

다음 JSON 형식으로만 응답하세요. 추가 텍스트 없이 JSON만 출력하세요:
{
  "prayers": [
    {
      "title": "기도 제목 (짧은 제목)",
      "content": "구체적인 기도 내용 (하나님께 직접 아뢰는 형식으로)"
    }
  ],
  "scriptures": [
    {
      "reference": "성경 책 장:절",
      "text": "말씀 본문 (개역개정)",
      "reason": "이 상황에서 이 말씀을 붙드는 이유"
    }
  ]
}

규칙:
- 기도 내용은 3~5개 작성
- 말씀 구절은 2~3개 작성
- 반드시 실제 성경에 존재하는 구절만 사용
- 기도 내용은 구체적이고 하나님께 직접 아뢰는 형식으로
- 따뜻하고 신앙적인 한국어로 작성
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  const clean = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

  try {
    return JSON.parse(clean) as PrayerResult;
  } catch {
    throw new Error("AI 응답 파싱 실패. 다시 시도해주세요.");
  }
}
