"use client";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const { status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<"kakao" | "naver" | null>(null);

  useEffect(() => {
    if (status === "authenticated") router.push("/dashboard");
  }, [status, router]);

  const handleLogin = async (provider: "kakao" | "naver") => {
    setLoading(provider);
    await signIn(provider, { callbackUrl: "/dashboard" });
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-pulse">🙏</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* 헤더 */}
      <div className="text-center mb-12 animate-in">
        <div className="text-6xl mb-5">🙏</div>
        <h1 className="text-4xl font-bold mb-3" style={{ color: "var(--gold)" }}>
          기도노트
        </h1>
        <p className="text-lg" style={{ color: "var(--muted)" }}>
          막막한 기도를, 구체적인 간구로
        </p>
        <p className="mt-4 text-sm italic" style={{ color: "var(--muted)" }}>
          "아무것도 염려하지 말고 다만 모든 일에 기도와 간구로" — 빌립보서 4:6
        </p>
      </div>

      {/* 로그인 카드 */}
      <div className="card w-full max-w-sm animate-in-1">
        <h2 className="text-center text-base font-medium mb-6" style={{ color: "var(--muted)" }}>
          간편하게 시작하세요
        </h2>

        <div className="flex flex-col gap-3">
          {/* 카카오 */}
          <button
            onClick={() => handleLogin("kakao")}
            disabled={!!loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl font-medium text-sm transition-all active:scale-95"
            style={{
              background: "#FEE500",
              color: "#191919",
              opacity: loading && loading !== "kakao" ? 0.5 : 1,
            }}
          >
            {loading === "kakao" ? (
              <span>로그인 중...</span>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd"
                    d="M9 1.5C4.86 1.5 1.5 4.19 1.5 7.5c0 2.1 1.35 3.96 3.39 5.07l-.87 3.24c-.09.33.27.6.57.42L8.46 13.8c.18.015.36.03.54.03 4.14 0 7.5-2.69 7.5-6S13.14 1.5 9 1.5z"
                    fill="#191919"/>
                </svg>
                카카오로 시작하기
              </>
            )}
          </button>

          {/* 네이버 */}
          <button
            onClick={() => handleLogin("naver")}
            disabled={!!loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl font-medium text-sm transition-all active:scale-95"
            style={{
              background: "#03C75A",
              color: "#fff",
              opacity: loading && loading !== "naver" ? 0.5 : 1,
            }}
          >
            {loading === "naver" ? (
              <span>로그인 중...</span>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M9.14 8.22L6.6 1H1v14h5.86V6.78L9.4 14H15V1H9.14v7.22z" fill="white"/>
                </svg>
                네이버로 시작하기
              </>
            )}
          </button>
        </div>

        <p className="mt-5 text-xs text-center" style={{ color: "var(--muted)" }}>
          로그인 시 서비스 이용약관에 동의하게 됩니다
        </p>
      </div>

      {/* 기능 소개 */}
      <div className="mt-16 grid grid-cols-3 gap-6 max-w-2xl w-full animate-in-3">
        {[
          { icon: "✍️", title: "상황 입력", desc: "지금 처한 상황을 솔직하게 적어보세요" },
          { icon: "🕯️", title: "기도 제목 생성", desc: "AI가 구체적인 기도와 말씀을 제안합니다" },
          { icon: "📖", title: "노션에 저장", desc: "기도 기록을 노션에 자동으로 저장합니다" },
        ].map((item) => (
          <div key={item.title} className="text-center p-3">
            <div className="text-3xl mb-2">{item.icon}</div>
            <div className="font-semibold text-sm mb-1" style={{ color: "var(--gold)" }}>{item.title}</div>
            <div className="text-xs" style={{ color: "var(--muted)" }}>{item.desc}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
