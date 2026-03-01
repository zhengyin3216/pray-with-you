"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const authKey = searchParams.get("authKey");
    const customerKey = searchParams.get("customerKey");

    if (!authKey || !customerKey) {
      setStatus("error");
      setMessage("잘못된 접근입니다.");
      return;
    }

    // 빌링키 발급 + 첫 결제 처리
    fetch("/api/payments/toss", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ authKey, customerKey }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setStatus("success");
        } else {
          throw new Error(data.error || "결제 처리 실패");
        }
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err.message);
      });
  }, [searchParams]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl animate-pulse mb-4">🙏</div>
          <p style={{ color: "var(--muted)" }}>결제를 처리하고 있습니다...</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-4xl mb-4">😢</div>
          <h1 className="text-xl font-bold mb-2">결제에 실패했습니다</h1>
          <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
            {message}
          </p>
          <button
            onClick={() => router.push("/subscription")}
            className="btn-gold"
          >
            다시 시도하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--gold)" }}>
          프리미엄 구독이 시작되었습니다!
        </h1>
        <p className="mb-2" style={{ color: "var(--muted)" }}>
          이제 무제한으로 기도 제목을 생성할 수 있습니다.
        </p>
        <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>
          매월 자동으로 갱신되며, 언제든지 해지할 수 있습니다.
        </p>
        <button
          onClick={() => router.push("/dashboard")}
          className="btn-gold px-8 py-3 text-base"
        >
          기도 시작하기 →
        </button>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-pulse">🙏</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
