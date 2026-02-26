"use client";

export default function Terms() {
  return (
    <main className="min-h-screen py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-10">
          <a href="/" className="text-sm" style={{ color: "var(--muted)" }}>← 홈으로</a>
        </div>

        <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--gold)" }}>
          이용약관
        </h1>
        <p className="text-sm mb-10" style={{ color: "var(--muted)" }}>
          최종 업데이트: 2026년 2월
        </p>

        <div className="space-y-8" style={{ color: "var(--text)", lineHeight: "1.8" }}>

          <section>
            <h2 className="text-lg font-bold mb-3" style={{ color: "var(--gold-light)" }}>
              제1조 (목적)
            </h2>
            <p style={{ color: "var(--muted)" }}>
              본 약관은 기도노트(이하 "서비스")의 이용 조건 및 절차, 이용자와 서비스 운영자 간의 권리와 의무를 규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3" style={{ color: "var(--gold-light)" }}>
              제2조 (서비스 내용)
            </h2>
            <p style={{ color: "var(--muted)" }}>서비스는 다음 기능을 제공합니다.</p>
            <ul className="mt-3 space-y-1 pl-4" style={{ color: "var(--muted)" }}>
              <li>• 사용자의 상황을 입력받아 AI 기반 기도 제목 및 말씀 구절 제안</li>
              <li>• 기도 기록의 노션(Notion) 자동 저장</li>
              <li>• 카카오 및 네이버 소셜 로그인</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3" style={{ color: "var(--gold-light)" }}>
              제3조 (이용자의 의무)
            </h2>
            <ul className="space-y-1 pl-4" style={{ color: "var(--muted)" }}>
              <li>• 타인의 개인정보를 무단으로 사용하지 않습니다.</li>
              <li>• 서비스를 불법적인 목적으로 이용하지 않습니다.</li>
              <li>• 서비스의 정상적인 운영을 방해하는 행위를 하지 않습니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3" style={{ color: "var(--gold-light)" }}>
              제4조 (AI 생성 콘텐츠 안내)
            </h2>
            <p style={{ color: "var(--muted)" }}>
              서비스가 제공하는 기도 제목 및 성경 구절은 AI(Google Gemini)가 생성한 참고 자료입니다. 성경 구절의 정확성은 반드시 직접 성경에서 확인하시기 바라며, 서비스는 AI 생성 내용의 신학적 정확성을 보장하지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3" style={{ color: "var(--gold-light)" }}>
              제5조 (서비스 중단 및 변경)
            </h2>
            <p style={{ color: "var(--muted)" }}>
              운영자는 서비스의 내용을 변경하거나 중단할 수 있으며, 이 경우 사전에 공지합니다. 불가피한 사유가 있을 경우 사후에 공지할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3" style={{ color: "var(--gold-light)" }}>
              제6조 (면책 조항)
            </h2>
            <p style={{ color: "var(--muted)" }}>
              서비스는 천재지변, 시스템 장애 등 불가항력으로 인한 서비스 중단에 대해 책임을 지지 않습니다. 이용자가 서비스를 이용하여 발생한 손해에 대해 운영자의 고의 또는 과실이 없는 한 책임을 지지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3" style={{ color: "var(--gold-light)" }}>
              제7조 (약관의 변경)
            </h2>
            <p style={{ color: "var(--muted)" }}>
              본 약관은 관련 법령 및 서비스 정책에 따라 변경될 수 있으며, 변경 시 서비스 내 공지를 통해 안내합니다.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}
