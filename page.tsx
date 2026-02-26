"use client";
// app/page.tsx
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated") router.push("/dashboard");
  }, [status]);

  const handleLogin = async (provider: "kakao" | "naver") => {
    setLoadingProvider(provider);
    await signIn(provider, { callbackUrl: "/dashboard" });
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* 헤더 */}
      <div className="text-center mb-12 animate-fadeIn">
        <div className="text-5xl mb-4">🙏</div>
        <h1 className="font-serif text-4xl font-bold mb-3" style={{ color: "var(--color-gold)" }}>
          기도노트
        </h1>
        <p className="text-lg" style={{ color: "var(--color-muted)" }}>
          막막한 기도를, 구체적인 간구로
        </p>
        <div className="mt-4 text-sm" style={{ color: "var(--color-muted)", fontStyle: "italic" }}>
          "아무것도 염려하지 말고 다만 모든 일에 기도와 간구로" — 빌립보서 4:6
        </div>
      </div>

      {/* 로그인 카드 */}
      <div className="card w-full max-w-sm animate-fadeIn-delay-1">
        <h2 className="font-serif text-center text-lg font-semibold mb-6" style={{ color: "var(--color-text)" }}>
          간편하게 시작하세요
        </h2>

        <div className="space-y-3">
          {/* 카카오 */}
          <button
            onClick={() => handleLogin("kakao")}
            disabled={!!loadingProvider}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg font-medium text-sm transition-all active:scale-95"
            style={{
              background: "#FEE500",
              color: "#191919",
              opacity: loadingProvider && loadingProvider !== "kakao" ? 0.5 : 1,
            }}
          >
            {loadingProvider === "kakao" ? (
              <span className="animate-spin">⟳</span>
            ) : (
              <KakaoIcon />
            )}
            카카오로 시작하기
          </button>

          {/* 네이버 */}
          <button
            onClick={() => handleLogin("naver")}
            disabled={!!loadingProvider}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg font-medium text-sm transition-all active:scale-95"
            style={{
              background: "#03C75A",
              color: "#ffffff",
              opacity: loadingProvider && loadingProvider !== "naver" ? 0.5 : 1,
            }}
          >
            {loadingProvider === "naver" ? (
              <span className="animate-spin">⟳</span>
            ) : (
              <NaverIcon />
            )}
            네이버로 시작하기
          </button>
        </div>

        <p className="mt-6 text-xs text-center" style={{ color: "var(--color-muted)" }}>
          가입 시 <span style={{ color: "var(--color-gold)" }}>서비스 이용약관</span>에 동의하게 됩니다
        </p>
      </div>

      {/* 기능 소개 */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl w-full animate-fadeIn-delay-3">
        {[
          { icon: "✍️", title: "상황 입력", desc: "지금 내가 처한 상황을 솔직하게 적어보세요" },
          { icon: "🕯️", title: "기도 제목 생성", desc: "AI가 구체적인 기도 제목과 붙들 말씀을 제안합니다" },
          { icon: "📖", title: "노션에 저장", desc: "기도 기록을 노션에 자동으로 저장해 관리하세요" },
        ].map((item) => (
          <div key={item.title} className="text-center p-4">
            <div className="text-3xl mb-3">{item.icon}</div>
            <div className="font-serif font-semibold mb-2" style={{ color: "var(--color-gold)" }}>
              {item.title}
            </div>
            <div className="text-sm" style={{ color: "var(--color-muted)" }}>{item.desc}</div>
          </div>
        ))}
      </div>
    </main>
  );
}

function KakaoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 0.75C4.44 0.75 0.75 3.69 0.75 7.32c0 2.34 1.56 4.41 3.93 5.58l-.99 3.69c-.09.33.27.6.57.42L8.1 14.7c.3.03.6.06.9.06 4.56 0 8.25-2.94 8.25-6.57C17.25 3.69 13.56.75 9 .75z"
        fill="#191919"
      />
    </svg>
  );
}

function NaverIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M9.14 8.22L6.6 1H1v14h5.86V6.78L9.4 14H15V1H9.14v7.22z"
        fill="white"
      />
    </svg>
  );
}
