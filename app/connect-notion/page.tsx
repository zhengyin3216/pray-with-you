"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";

function ConnectNotionContent() {
  const router = useRouter();
  const [pages, setPages] = useState<{ id: string; title: string }[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/notion/pages")
      .then((r) => r.json())
      .then((d) => {
        setPages(d.pages || []);
        if (d.defaultPageId) setSelectedId(d.defaultPageId);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!selectedId) return;
    setSaving(true);
    await fetch("/api/notion/pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pageId: selectedId }),
    });
    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="card w-full max-w-sm animate-in">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">📎</div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--gold)" }}>
            노션 연결 완료!
          </h2>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            기도 기록을 저장할 기본 페이지를 선택해주세요.
          </p>
        </div>

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => <div key={i} className="h-10 shimmer rounded-lg" />)}
          </div>
        ) : (
          <div className="space-y-4">
            <select className="input-field" value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}>
              <option value="">페이지 선택...</option>
              {pages.map((p) => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              선택한 페이지 안에 기도 기록이 생성됩니다.
            </p>
            <button className="btn-gold w-full" onClick={handleSave}
              disabled={!selectedId || saving}>
              {saving ? "저장 중..." : "설정 완료"}
            </button>
            <button className="w-full py-2 text-sm" onClick={() => router.push("/dashboard")}
              style={{ color: "var(--muted)" }}>
              나중에 설정하기
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

export default function ConnectNotion() {
  return <Suspense><ConnectNotionContent /></Suspense>;
}
