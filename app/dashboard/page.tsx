"use client";

import { useState, useEffect, Suspense } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

const PRAYER_TYPES = ["간구", "감사", "회개", "중보"] as const;

interface PrayerCategory {
  name: string;
  prayers: { title: string; content: string }[];
}
interface PrayerResult {
  categories: PrayerCategory[];
  scriptures: { reference: string; text: string; reason: string }[];
}
interface NotionPage {
  id: string;
  title: string;
}
interface SubStatus {
  status: string;
  remaining: number | null;
  monthlyUsage: number;
  canGenerate: boolean;
}

function DashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [situation, setSituation] = useState("");
  const [prayerType, setPrayerType] = useState("간구");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PrayerResult | null>(null);
  const [logId, setLogId] = useState<string | null>(null);
  const [notionConnected, setNotionConnected] = useState(false);
  const [notionPages, setNotionPages] = useState<NotionPage[]>([]);
  const [selectedPageId, setSelectedPageId] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedUrl, setSavedUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [subStatus, setSubStatus] = useState<SubStatus | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status, router]);

  useEffect(() => {
    if (searchParams.get("notion") === "error") {
      setError("노션 연결 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  }, [searchParams]);

  useEffect(() => {
    if (session) {
      // 노션 페이지 불러오기
      fetch("/api/notion/pages")
        .then((r) => r.json())
        .then((d) => {
          setNotionConnected(d.connected);
          setNotionPages(d.pages || []);
          if (d.defaultPageId) setSelectedPageId(d.defaultPageId);
        });

      // 구독 상태 불러오기
      fetch("/api/subscription")
        .then((r) => r.json())
        .then(setSubStatus);
    }
  }, [session]);

  const handleGenerate = async () => {
    if (!situation.trim()) return;

    // 무료 사용량 초과 체크
    if (subStatus && !subStatus.canGenerate) {
      router.push("/subscription");
      return;
    }

    setLoading(true);
    setResult(null);
    setSavedUrl(null);
    setError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ situation, prayerType }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data.result);
      setLogId(data.logId);
      // 사용량 업데이트
      setSubStatus((prev) =>
        prev
          ? {
              ...prev,
              monthlyUsage: prev.monthlyUsage + 1,
              remaining: prev.remaining !== null ? Math.max(0, prev.remaining - 1) : null,
              canGenerate:
                prev.status === "premium" || (prev.remaining !== null && prev.remaining - 1 > 0),
            }
          : prev
      );
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToNotion = async () => {
    if (!logId || !selectedPageId) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/notion/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logId, pageId: selectedPageId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSavedUrl(data.notionUrl);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-pulse">🙏</div>
      </div>
    );
  }

  const userName =
    session?.user?.name || session?.user?.email?.split("@")[0] || "성도";
  const isPremium = subStatus?.status === "premium";

  return (
    <main className="min-h-screen">
      {/* 헤더 */}
      <header
        className="border-b px-6 py-4 flex items-center justify-between"
        style={{ borderColor: "var(--border)", background: "var(--deep)" }}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">🙏</span>
          <span className="font-bold text-xl" style={{ color: "var(--gold)" }}>
            함께기도해
          </span>
        </div>
        <div className="flex items-center gap-3">
          {/* 구독 상태 배지 */}
          <button
            onClick={() => router.push("/subscription")}
            className="text-xs px-3 py-1 rounded-full font-medium"
            style={{
              background: isPremium ? "var(--gold)" : "var(--deep)",
              color: isPremium ? "var(--midnight)" : "var(--muted)",
              border: isPremium ? "none" : "1px solid var(--border)",
            }}
          >
            {isPremium ? "👑 프리미엄" : `무료 ${subStatus?.remaining ?? 3}회 남음`}
          </button>

          {!notionConnected ? (
            <a
              href="/api/notion/auth"
              className="text-sm px-4 py-2 rounded-lg"
              style={{ border: "1px solid var(--border)", color: "var(--muted)" }}
            >
              📎 노션 연결
            </a>
          ) : (
            <span className="text-sm" style={{ color: "#4ade80" }}>
              ✓ 노션 연결됨
            </span>
          )}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-sm"
            style={{ color: "var(--muted)" }}
          >
            로그아웃
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8 animate-in">
          <h2 className="text-2xl font-bold mb-1">
            {userName}님, 오늘의 기도를 시작해요 👋
          </h2>
          <p style={{ color: "var(--muted)" }}>
            어떤 상황을 가지고 하나님 앞에 나아가고 싶으신가요?
          </p>
        </div>

        {/* 무료 사용량 초과 배너 */}
        {subStatus && !subStatus.canGenerate && (
          <div
            className="card mb-6 text-center"
            style={{ border: "1px solid var(--gold)" }}
          >
            <p className="font-semibold mb-2">이번 달 무료 횟수를 모두 사용했습니다</p>
            <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
              프리미엄으로 업그레이드하면 무제한으로 기도 제목을 생성할 수 있습니다.
            </p>
            <button
              onClick={() => router.push("/subscription")}
              className="btn-gold"
            >
              프리미엄 시작하기 — ₩9,900/월
            </button>
          </div>
        )}

        <div className="card mb-6 animate-in-1">
          <div className="flex gap-2 mb-4 flex-wrap">
            {PRAYER_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setPrayerType(type)}
                className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
                style={{
                  background: prayerType === type ? "var(--gold)" : "var(--deep)",
                  color: prayerType === type ? "var(--midnight)" : "var(--muted)",
                  border: `1px solid ${prayerType === type ? "var(--gold)" : "var(--border)"}`,
                }}
              >
                {type}
              </button>
            ))}
          </div>
          <textarea
            className="input-field"
            rows={5}
            placeholder={
              "지금 어떤 상황인지 편하게 적어주세요.\n\n예: 중요한 결정을 앞두고 있는데 어떤 방향이 하나님의 뜻인지 분별이 안 돼요..."
            }
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
          />
          {error && (
            <p className="mt-3 text-sm" style={{ color: "#f87171" }}>
              {error}
            </p>
          )}
          <div className="mt-4 flex justify-end">
            <button
              className="btn-gold"
              onClick={handleGenerate}
              disabled={loading || !situation.trim() || (subStatus !== null && !subStatus.canGenerate)}
            >
              {loading
                ? "기도 제목 생성 중..."
                : subStatus && !subStatus.canGenerate
                ? "횟수 초과 — 프리미엄 필요"
                : "기도 제목 생성하기 →"}
            </button>
          </div>
        </div>

        {loading && (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="card space-y-3">
                <div className="h-5 w-32 shimmer" />
                {[1, 2, 3].map((j) => (
                  <div
                    key={j}
                    className="h-4 shimmer"
                    style={{ width: `${65 + j * 10}%` }}
                  />
                ))}
              </div>
            ))}
          </div>
        )}

        {result && !loading && (
          <div className="space-y-5">
            <div className="card animate-in">
              <h3 className="font-bold text-lg mb-4" style={{ color: "var(--gold)" }}>
                📌 기도 내용
              </h3>
              <div
                className="text-sm px-3 py-2 rounded-lg mb-4"
                style={{ background: "var(--deep)", color: "var(--muted)" }}
              >
                현재 상황: {situation}
              </div>
              <div className="space-y-5">
                {result.categories?.map((cat, ci) => (
                  <div key={ci}>
                    <div
                      className="text-xs font-semibold mb-2"
                      style={{
                        color: "var(--muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      함께 드리는 기도 · {cat.name}
                    </div>
                    <div className="space-y-2">
                      {cat.prayers.map((prayer, pi) => (
                        <div
                          key={pi}
                          className="p-4 rounded-lg border-l-2"
                          style={{ background: "var(--deep)", borderColor: "var(--gold)" }}
                        >
                          <div className="font-semibold text-sm mb-1" style={{ color: "var(--gold)" }}>
                            {prayer.title}
                          </div>
                          <div className="text-sm leading-relaxed">{prayer.content}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card animate-in-1">
              <h3 className="font-bold text-lg mb-4" style={{ color: "var(--gold)" }}>
                📌 붙드는 말씀
              </h3>
              <div className="space-y-4">
                {result.scriptures.map((s, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-lg"
                    style={{ background: "var(--deep)", border: "1px solid var(--border)" }}
                  >
                    <div className="font-bold mb-2" style={{ color: "var(--gold-light)" }}>
                      {s.reference}
                    </div>
                    <blockquote
                      className="text-sm leading-relaxed mb-2 pl-3 italic"
                      style={{ borderLeft: "2px solid var(--gold)" }}
                    >
                      {s.text}
                    </blockquote>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>
                      ✦ {s.reason}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-center" style={{ color: "var(--muted)" }}>
                * 개역개정 기준 · 직접 성경에서 확인하시기를 권합니다
              </p>
            </div>

            <div className="card animate-in-2">
              <h3 className="font-bold text-lg mb-4" style={{ color: "var(--gold)" }}>
                📎 노션에 저장하기
              </h3>
              {!notionConnected ? (
                <div className="text-center py-4">
                  <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
                    노션을 연결하면 기도 기록이 자동으로 저장됩니다.
                  </p>
                  <a href="/api/notion/auth" className="btn-gold inline-block">
                    노션 연결하기
                  </a>
                </div>
              ) : savedUrl ? (
                <div className="text-center py-4">
                  <div className="text-3xl mb-3">✨</div>
                  <p className="font-semibold mb-3" style={{ color: "#4ade80" }}>
                    노션에 저장되었습니다!
                  </p>
                  <a
                    href={savedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold inline-block text-sm"
                  >
                    노션에서 확인하기 →
                  </a>
                </div>
              ) : (
                <div className="space-y-3">
                  <select
                    className="input-field"
                    value={selectedPageId}
                    onChange={(e) => setSelectedPageId(e.target.value)}
                  >
                    <option value="">저장할 페이지 선택...</option>
                    {notionPages.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                  <button
                    className="btn-gold w-full"
                    onClick={handleSaveToNotion}
                    disabled={saving || !selectedPageId}
                  >
                    {saving ? "저장 중..." : "노션에 저장하기"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function Dashboard() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-4xl animate-pulse">🙏</div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
