import { useState, useEffect } from "react";

const PRAYER_TYPES = ["간구", "감사", "회개", "중보"];

function PhoneFrame({ children }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", minHeight: "100vh", background: "#f2f2f7", fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', sans-serif", padding: "40px 0" }}>
      <div style={{ width: 393, minHeight: 852, background: "#ffffff", borderRadius: 54, overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.08)", position: "relative", display: "flex", flexDirection: "column" }}>
        <div style={{ position: "absolute", top: 14, left: "50%", transform: "translateX(-50%)", width: 126, height: 37, background: "#000", borderRadius: 20, zIndex: 100 }} />
        <div style={{ height: 59, flexShrink: 0 }} />
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>{children}</div>
      </div>
    </div>
  );
}

function LoginScreen({ onLogin }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "40px 32px 48px" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 16 }}>
        <div style={{ width: 88, height: 88, background: "linear-gradient(145deg, #fff5e6, #fde8c0)", borderRadius: 22, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, boxShadow: "0 4px 20px rgba(255,180,60,0.25)" }}>🙏</div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.5, color: "#1c1c1e" }}>기도노트</div>
          <div style={{ fontSize: 15, color: "#8e8e93", marginTop: 6 }}>기도 제목을 구체화하는 AI 서비스</div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <button onClick={onLogin} style={{ height: 54, background: "#FEE500", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 600, color: "#191919", cursor: "pointer", fontFamily: "inherit" }}>카카오로 시작하기</button>
        <button onClick={onLogin} style={{ height: 54, background: "#03C75A", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 600, color: "#fff", cursor: "pointer", fontFamily: "inherit" }}>네이버로 시작하기</button>
        <p style={{ textAlign: "center", fontSize: 12, color: "#c7c7cc", marginTop: 4 }}>로그인 시 이용약관에 동의하게 됩니다</p>
      </div>
    </div>
  );
}

function DashboardScreen({ onGenerate }) {
  const [situation, setSituation] = useState("");
  const [type, setType] = useState("간구");
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "8px 20px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.5, color: "#1c1c1e" }}>함께기도해</div>
        <div style={{ width: 32, height: 32, borderRadius: 16, background: "#f2f2f7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>👤</div>
      </div>
      <div style={{ padding: "24px 20px 32px", flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <div style={{ fontSize: 17, fontWeight: 600, color: "#1c1c1e" }}>오늘의 기도를 시작해요 👋</div>
          <div style={{ fontSize: 14, color: "#8e8e93", marginTop: 3 }}>어떤 상황을 하나님 앞에 가져가고 싶으신가요?</div>
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#8e8e93", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>기도 유형</div>
          <div style={{ display: "flex", gap: 8 }}>
            {PRAYER_TYPES.map(t => (
              <button key={t} onClick={() => setType(t)} style={{ flex: 1, height: 36, border: "none", borderRadius: 10, fontSize: 14, fontWeight: type === t ? 600 : 400, background: type === t ? "#1c1c1e" : "#f2f2f7", color: type === t ? "#fff" : "#3a3a3c", cursor: "pointer", fontFamily: "inherit" }}>{t}</button>
            ))}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#8e8e93", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>현재 상황</div>
          <textarea value={situation} onChange={e => setSituation(e.target.value)}
            placeholder={"지금 어떤 상황인지 편하게 적어주세요.\n\n예: 중요한 결정을 앞두고 있는데 어느 방향이 맞는지 모르겠어요..."}
            style={{ width: "100%", minHeight: 160, background: "#f2f2f7", border: "none", borderRadius: 14, padding: "14px 16px", fontSize: 15, color: "#1c1c1e", fontFamily: "inherit", resize: "none", outline: "none", lineHeight: 1.6, boxSizing: "border-box" }}
          />
        </div>
        <button onClick={() => situation.trim() && onGenerate(situation, type)} style={{ height: 54, background: situation.trim() ? "#1c1c1e" : "#e5e5ea", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 600, color: situation.trim() ? "#fff" : "#aeaeb2", cursor: situation.trim() ? "pointer" : "default", fontFamily: "inherit" }}>
          기도를 더 구체적으로 드리기
        </button>
      </div>
    </div>
  );
}

function ResultScreen({ situation, prayerType, onSave, onBack }) {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // ✅ useState 아닌 useEffect 사용 (핵심 버그 수정)
  useEffect(() => {
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
- 0~2개만 포함 (비용 절감을 위해)
- 반드시 개역개정 실제 본문 그대로
- reference와 text는 실제로 일치해야 함`;

    fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1500,
        messages: [{ role: "user", content: prompt }],
      }),
    })
      .then(r => r.json())
      .then(data => {
        const text = data.content?.[0]?.text || "";
        const clean = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        const parsed = JSON.parse(clean);
        setResult(parsed);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("생성 중 오류가 발생했습니다. 다시 시도해주세요.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: 40 }}>
        <div style={{ fontSize: 48 }}>🕯️</div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 17, fontWeight: 600, color: "#1c1c1e" }}>기도를 함께 준비하고 있어요</div>
          <div style={{ fontSize: 14, color: "#8e8e93", marginTop: 6 }}>잠시만 기다려주세요...</div>
        </div>
        <style>{`@keyframes pulse{0%,80%,100%{opacity:.3}40%{opacity:1}}`}</style>
        <div style={{ display: "flex", gap: 6 }}>
          {[0,1,2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: 4, background: "#c7c7cc", animation: `pulse 1.2s ease-in-out ${i*0.2}s infinite` }} />)}
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 40, textAlign: "center" }}>
        <div style={{ fontSize: 40 }}>😥</div>
        <div style={{ fontSize: 15, color: "#ff3b30", lineHeight: 1.5 }}>{error || "알 수 없는 오류가 발생했습니다."}</div>
        <button onClick={onBack} style={{ height: 44, padding: "0 24px", background: "#1c1c1e", border: "none", borderRadius: 12, color: "#fff", fontSize: 15, fontFamily: "inherit", cursor: "pointer" }}>돌아가기</button>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "8px 20px 0" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", fontSize: 16, color: "#007aff", cursor: "pointer", fontFamily: "inherit", padding: "4px 0" }}>‹ 돌아가기</button>
      </div>
      <div style={{ padding: "16px 20px 32px", display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ background: "#f2f2f7", borderRadius: 12, padding: "12px 14px", display: "flex", gap: 10 }}>
          <span style={{ fontSize: 16 }}>💬</span>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#8e8e93", marginBottom: 3 }}>{prayerType} 기도</div>
            <div style={{ fontSize: 14, color: "#3a3a3c", lineHeight: 1.5 }}>{situation}</div>
          </div>
        </div>

        {result.categories?.map((cat, ci) => (
          <div key={ci}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#8e8e93", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>
              함께 드리는 기도 · {cat.name}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {cat.prayers.map((p, pi) => (
                <div key={pi} style={{ background: "#f2f2f7", borderRadius: 14, padding: "14px 16px" }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1c1c1e", marginBottom: 6 }}>{p.title}</div>
                  <div style={{ fontSize: 14, color: "#3a3a3c", lineHeight: 1.6 }}>{p.content}</div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#8e8e93", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>붙드는 말씀</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {result.scriptures?.map((s, i) => (
              <div key={i} style={{ background: "#fff9f0", borderRadius: 14, padding: "14px 16px", borderLeft: "3px solid #ff9500" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#ff9500", marginBottom: 6 }}>{s.reference}</div>
                <div style={{ fontSize: 14, color: "#3a3a3c", lineHeight: 1.6, fontStyle: "italic", marginBottom: 8 }}>"{s.text}"</div>
                <div style={{ fontSize: 13, color: "#8e8e93", lineHeight: 1.5 }}>✦ {s.reason}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: "#c7c7cc", textAlign: "center", marginTop: 10 }}>* 개역개정 · 직접 성경에서 확인하세요</p>
        </div>

        <button onClick={onSave} style={{ height: 54, background: "#000", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 600, color: "#fff", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          📎 노션에 저장하기
        </button>
      </div>
    </div>
  );
}

function NotionScreen({ onSaved }) {
  const [selected, setSelected] = useState("");
  const pages = ["📖 기도 일지", "🙏 신앙 노트", "✍️ 매일 묵상", "📚 성경 공부"];
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "24px 20px 32px" }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: "#1c1c1e", marginBottom: 6 }}>노션 페이지 선택</div>
      <div style={{ fontSize: 15, color: "#8e8e93", marginBottom: 28 }}>기도 기록을 저장할 페이지를 선택해주세요</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        {pages.map(p => (
          <button key={p} onClick={() => setSelected(p)} style={{ height: 52, background: selected === p ? "#f0f0f5" : "#f2f2f7", border: selected === p ? "1.5px solid #1c1c1e" : "1.5px solid transparent", borderRadius: 14, fontSize: 15, fontWeight: selected === p ? 600 : 400, color: "#1c1c1e", cursor: "pointer", fontFamily: "inherit", textAlign: "left", padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {p}{selected === p && <span>✓</span>}
          </button>
        ))}
      </div>
      <button onClick={() => selected && onSaved()} style={{ height: 54, background: selected ? "#1c1c1e" : "#e5e5ea", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 600, color: selected ? "#fff" : "#aeaeb2", cursor: selected ? "pointer" : "default", fontFamily: "inherit", marginTop: 20 }}>
        저장하기
      </button>
    </div>
  );
}

function SavedScreen({ onNew }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 32px", gap: 16, textAlign: "center" }}>
      <div style={{ fontSize: 64 }}>✨</div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#1c1c1e" }}>노션에 저장되었습니다</div>
        <div style={{ fontSize: 15, color: "#8e8e93", marginTop: 8, lineHeight: 1.5 }}>기도 후 느낀 변화와 응답을<br />노션에서 직접 채워보세요</div>
      </div>
      <div style={{ background: "#f2f2f7", borderRadius: 14, padding: "14px 20px", width: "100%", textAlign: "left" }}>
        {["📌 기도를 더 구체적으로 드리기", "📌 붙드는 말씀", "📌 기도하면서 느낀 변화", "📌 기도 응답"].map((item, i, arr) => (
          <div key={i} style={{ fontSize: 14, color: "#3a3a3c", padding: "4px 0", borderBottom: i < arr.length - 1 ? "1px solid #e5e5ea" : "none" }}>{item}</div>
        ))}
      </div>
      <button onClick={onNew} style={{ height: 54, background: "#1c1c1e", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 600, color: "#fff", cursor: "pointer", fontFamily: "inherit", width: "100%", marginTop: 8 }}>
        새 기도 시작하기
      </button>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("login");
  const [situation, setSituation] = useState("");
  const [prayerType, setPrayerType] = useState("");
  return (
    <PhoneFrame>
      {screen === "login" && <LoginScreen onLogin={() => setScreen("dashboard")} />}
      {screen === "dashboard" && <DashboardScreen onGenerate={(s, t) => { setSituation(s); setPrayerType(t); setScreen("result"); }} />}
      {screen === "result" && <ResultScreen situation={situation} prayerType={prayerType} onBack={() => setScreen("dashboard")} onSave={() => setScreen("notion")} />}
      {screen === "notion" && <NotionScreen onSaved={() => setScreen("saved")} />}
      {screen === "saved" && <SavedScreen onNew={() => setScreen("dashboard")} />}
    </PhoneFrame>
  );
}
