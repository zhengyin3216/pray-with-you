import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface PrayerCategory {
  name: string;
  prayers: { title: string; content: string }[];
}

export interface PrayerResult {
  categories: PrayerCategory[];
  scriptures: { reference: string; text: string; reason: string }[];
}

export async function generatePrayer(
  situation: string,
  prayerType: string
): Promise<PrayerResult> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `당신은 성경적 기도를 도와주는 조력자입니다.
사용자의 현재 상황을 듣고, 상황에 맞는 카테고리 2~3개를 만들고 각 카테고리 아래에 구체적인 기도 내용을 리스트 형태로 작성해주세요.

[현재 상황]
${situation}

[기도 유형]
${prayerType}

다음 JSON 형식으로만 응답하세요. JSON 외 텍스트는 절대 포함하지 마세요:
{
  "categories": [
    {
      "name": "카테고리 이름 (상황을 반영한 구체적인 이름, 예: 결정의 지혜, 관계 회복, 마음의 평안)",
      "prayers": [
        {
          "title": "구체적으로 구하는 것 (짧은 제목)",
          "content": "하나님께 직접 아뢰는 기도 내용 (2~3문장)"
        }
      ]
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

목표:
- 불필요한 추임새(예: "하나님 아버지", "사랑의 주님", "전능하신 하나님") 금지
- 긴 문장 금지. 간결한 한 줄 기도 제목만 생성
- 각 항목은 "- ~하게 하소서" 형태의 한 문장만 허용
- 각 항목 길이 제한: 30자 이내 (공백 포함)
- 카테고리는 2~3개
- 각 카테고리의 items는 3~6개
- 카테고리 이름은 상황을 반영한 구체적인 이름 (추상어만 금지: 믿음, 평안, 은혜)

성경 구절:
- 0~2개만 포함
- 반드시 개역개정 실제 본문 그대로
- reference와 text는 실제로 일치해야 함`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  const clean = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

  try {
    return JSON.parse(clean) as PrayerResult;
  } catch {
    throw new Error("AI 응답 파싱 실패. 다시 시도해주세요.");
  }
}
