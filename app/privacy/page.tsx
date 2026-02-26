"use client";

export default function Privacy() {
  return (
    <main className="min-h-screen py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-10">
          <a href="/" className="text-sm" style={{ color: "var(--muted)" }}>← 홈으로</a>
        </div>

        <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--gold)" }}>
          개인정보 처리방침
        </h1>
        <p className="text-sm mb-10" style={{ color: "var(--muted)" }}>
          최종 업데이트: 2026년 2월
        </p>

        <div className="space-y-8" style={{ color: "var(--text)", lineHeight: "1.8" }}>

          <section>
            <h2 className="text-lg font-bold mb-3" style={{ color: "var(--gold-light)" }}>
              1. 수집하는 개인정보
            </h2>
            <p>기도노트(이하 "서비스")는 서비스 제공을 위해 아래 정보를 수집합니다.</p>
            <ul className="mt-3 space-y-1 pl-4" style={{ color: "var(--muted)" }}>
              <li>• 소셜 로그인(카카오, 네이버)을 통한 이름, 이메일, 프로필 사진</li>
              <li>• 서비스 이용 시 입력한 기도 상황 및 생성된 기도 내용</li>
              <li>• 노션 연동 시 노션 액세스 토큰 및 선택한 페이지 정보</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3" style={{ color: "var(--gold-light)" }}>
              2. 개인정보 수집 및 이용 목적
            </h2>
            <ul className="space-y-1 pl-4" style={{ color: "var(--muted)" }}>
              <li>• 회원 식별 및 서비스 로그인 처리</li>
              <li>• 기도 기록 저장 및 노션 자동 저장 기능 제공</li>
              <li>• 서비스 개선 및 오류 처리</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3" style={{ color: "var(--gold-light)" }}>
              3. 개인정보 보유 및 이용 기간
            </h2>
            <p style={{ color: "var(--muted)" }}>
              회원 탈퇴 시 또는 수집 목적 달성 시까지 보유하며, 관련 법령에 따라 일정 기간 보존이 필요한 경우 해당 기간 동안 보관합니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3" style={{ color: "var(--gold-light)" }}>
              4. 개인정보 제3자 제공
            </h2>
            <p style={{ color: "var(--muted)" }}>
              서비스는 이용자의 개인정보를 원칙적으로 제3자에게 제공하지 않습니다. 단, 이용자가 직접 노션 연동을 선택한 경우 노션(Notion Labs Inc.)에 필요한 정보가 전달됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3" style={{ color: "var(--gold-light)" }}>
              5. 개인정보 처리 위탁
            </h2>
            <ul className="space-y-1 pl-4" style={{ color: "var(--muted)" }}>
              <li>• Google (Gemini AI): 기도 제목 생성 처리</li>
              <li>• Vercel: 서버 운영 및 데이터 저장</li>
              <li>• Notion Labs Inc.: 노션 연동 서비스</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3" style={{ color: "var(--gold-light)" }}>
              6. 이용자의 권리
            </h2>
            <p style={{ color: "var(--muted)" }}>
              이용자는 언제든지 개인정보 열람, 수정, 삭제, 처리 정지를 요청할 수 있습니다. 요청은 아래 이메일로 문의해 주세요.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3" style={{ color: "var(--gold-light)" }}>
              7. 문의
            </h2>
            <p style={{ color: "var(--muted)" }}>
              개인정보 관련 문의사항은 서비스 운영자에게 연락해 주세요.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}
