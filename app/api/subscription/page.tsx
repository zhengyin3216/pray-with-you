"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    TossPayments: any;
  }
}

export default function SubscriptionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [subStatus, setSubStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [tossReady, setTossReady] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetch("/api/subscription")
        .then((r) => r.json())
        .then(setSubStatus);
    }
  }, [session]);

  const handleSubscribe = async () => {
    if (!tossReady) {
      setMessage("결제 모듈을 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const tossPayments = window.TossPayments(process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!);
      const customerKey = `user-${(session?.user as any)?.id}`;

      await tossPayments.requestBillingAuth("카드", {
        customerKey,
        successUrl: `${window.location.origin}/subscription/success`,
        failUrl: `${window.location.origin}/subscription?error=fail`,
      });
    } catch (error: any) {
      if (error.code !== "USER_CANCEL") {
        setMessage("결제 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm("구독을 해지하시겠습니까? 현재 기간 종료까지는 계속 이용 가능합니다.")) return;
    setCancelling(true);
    try {
      await fetch("/api/payments/toss/confirm", { method: "POST" });
      setMessage("구독이 해지되었습니다. 현재 기간 종료 시까지 이용 가능합니다.");
      const res = await fetch("/api/subscription");
      setSubStatus(await res.json());
    } catch {
      setMessage("해지 중 오류가 발생했습니다.");
    } finally {
      setCancelling(false);
    }
  };

  if (status === "loading" || !subStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-pulse">🙏</div>
      </div>
    );
  }

  const isPremium = subStatus.status === "premium";
  const isCancelled = subStatus.status === "cancelled";

  return (
    <>
      <Script
        src="https://js.tosspayments.com/v1/payment"
        onLoad={() => setTossReady(true)}
      />
      <main className="min-h-screen px-4 py-10">
        <div className="max-w-2xl mx-auto">
          {/* 헤더 */}
          <div className="text-center mb-10">
            <button
              onClick={() => router.push("/dashboard")}
              className="text-sm mb-6 inline-block"
              style={{ color: "var(--muted)" }}
            >
              ← 대시보드로
            </button>
            <div className="text-5xl mb-4">✨</div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--gold)" }}>
              함께기도해 프리미엄
            </h1>
            <p style={{ color: "var(--muted)" }}>
              무제한으로 기도 제목을 생성하고 기도 여정을 기록하세요
            </p>
          </div>

          {/* 현재 구독 상태 */}
          {isPremium && (
            <div
              className="card mb-6 text-center"
              style={{ border: "1px solid var(--gold)", background: "rgba(212,175,55,0.05)" }}
            >
              <div className="text-2xl mb-2">👑</div>
              <p className="font-bold text-lg" style={{ color: "var(--gold)" }}>
                프리미엄 구독 중
              </p>
              {subStatus.subscriptionEnd && (
                <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
                  다음 결제일:{" "}
                  {new Date(subStatus.subscriptionEnd).toLocaleDateString("ko-KR")}
                </p>
              )}
              {!isCancelled && (
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="mt-4 text-sm px-4 py-2 rounded-lg"
                  style={{ border: "1px solid var(--border)", color: "var(--muted)" }}
                >
                  {cancelling ? "처리 중..." : "구독 해지"}
                </button>
              )}
              {isCancelled && (
                <p className="mt-2 text-sm" style={{ color: "#f87171" }}>
                  해지 예정 - 기간 종료 시까지 이용 가능
                </p>
              )}
            </div>
          )}

          {/* 무료 사용량 */}
          {!isPremium && (
            <div className="card mb-6">
              <p className="text-sm font-medium mb-2" style={{ color: "var(--muted)" }}>
                이번 달 사용량
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="flex-1 h-2 rounded-full overflow-hidden"
                  style={{ background: "var(--deep)" }}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, ((subStatus.monthlyUsage || 0) / 3) * 100)}%`,
                      background: "var(--gold)",
                    }}
                  />
                </div>
                <span className="text-sm font-bold">
                  {subStatus.monthlyUsage || 0} / 3회
                </span>
              </div>
              {subStatus.remaining === 0 && (
                <p className="mt-2 text-sm" style={{ color: "#f87171" }}>
                  이번 달 무료 횟수를 모두 사용했습니다. 프리미엄으로 업그레이드하세요.
                </p>
              )}
            </div>
          )}

          {/* 플랜 비교 */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {/* 무료 플랜 */}
            <div className="card" style={{ opacity: isPremium ? 0.5 : 1 }}>
              <div className="font-bold mb-1">무료</div>
              <div
                className="text-2xl font-bold mb-4"
                style={{ color: "var(--gold)" }}
              >
                ₩0
              </div>
              <ul className="space-y-2 text-sm" style={{ color: "var(--muted)" }}>
                <li>✓ 월 3회 기도 제목 생성</li>
                <li>✓ AI 기도 제목 + 말씀</li>
                <li>✓ 노션 저장</li>
                <li style={{ opacity: 0.4 }}>✗ 무제한 생성</li>
                <li style={{ opacity: 0.4 }}>✗ 기도 히스토리</li>
              </ul>
            </div>

            {/* 프리미엄 플랜 */}
            <div
              className="card relative"
              style={{
                border: `2px solid var(--gold)`,
                background: "rgba(212,175,55,0.05)",
              }}
            >
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs px-3 py-1 rounded-full font-bold"
                style={{ background: "var(--gold)", color: "var(--midnight)" }}
              >
                추천
              </div>
              <div className="font-bold mb-1" style={{ color: "var(--gold)" }}>
                프리미엄
              </div>
              <div className="text-2xl font-bold mb-4" style={{ color: "var(--gold)" }}>
                ₩9,900
                <span className="text-sm font-normal" style={{ color: "var(--muted)" }}>
                  /월
                </span>
              </div>
              <ul className="space-y-2 text-sm" style={{ color: "var(--muted)" }}>
                <li>✓ 무제한 기도 제목 생성</li>
                <li>✓ AI 기도 제목 + 말씀</li>
                <li>✓ 노션 자동 저장</li>
                <li>✓ 기도 히스토리 전체</li>
                <li>✓ 매달 자동 갱신</li>
              </ul>
            </div>
          </div>

          {/* 결제 버튼 */}
          {!isPremium && (
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="btn-gold w-full py-4 text-base font-bold"
            >
              {loading ? "결제 페이지 이동 중..." : "프리미엄 시작하기 — ₩9,900/월"}
            </button>
          )}

          {message && (
            <p className="mt-4 text-center text-sm" style={{ color: "var(--muted)" }}>
              {message}
            </p>
          )}

          <p className="mt-4 text-center text-xs" style={{ color: "var(--muted)" }}>
            언제든지 해지 가능 · 토스페이먼츠 안전 결제
          </p>
        </div>
      </main>
    </>
  );
}
