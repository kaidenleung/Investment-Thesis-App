import { useState } from "react";

export default function App() {
  const [ticker, setTicker] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [loadingMsg, setLoadingMsg] = useState("");

  const messages = [
    "Pulling financial data...",
    "Scanning recent filings...",
    "Analyzing competitive position...",
    "Building bull case...",
    "Building bear case...",
    "Scoring key metrics...",
    "Finalizing thesis...",
  ];

  const analyze = async () => {
    if (!ticker.trim()) return;
    setLoading(true);
    setError(null);
    setAnalysis(null);

    let i = 0;
    setLoadingMsg(messages[0]);
    const interval = setInterval(() => {
      i = (i + 1) % messages.length;
      setLoadingMsg(messages[i]);
    }, 2200);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker }),
      });
      const parsed = await res.json();
      if (parsed.error) throw new Error(parsed.error);
      setAnalysis(parsed);
    } catch (e) {
      setError(e.message || "Could not generate analysis. Check the ticker and try again.");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const scoreColor = (s) => {
    if (s >= 8) return "#4ade80";
    if (s >= 6) return "#facc15";
    if (s >= 4) return "#fb923c";
    return "#f87171";
  };

  const ratingColor = (r) => {
    if (r === "BUY") return "#4ade80";
    if (r === "HOLD") return "#facc15";
    return "#f87171";
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=JetBrains+Mono:wght@400;500;600&family=Outfit:wght@300;400;500&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #06080e; color: #d4d0c8; font-family: 'Outfit', sans-serif; min-height: 100vh; }
        .wrap { max-width: 860px; margin: 0 auto; padding: 64px 24px 120px; }
        .wordmark { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; letter-spacing: 5px; text-transform: uppercase; color: #2d6a4f; margin-bottom: 48px; display: flex; align-items: center; gap: 10px; }
        .wordmark::before { content: ''; display: inline-block; width: 6px; height: 6px; background: #4ade80; border-radius: 50%; }
        .hero-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(52px, 8vw, 96px); font-weight: 700; line-height: 0.95; letter-spacing: -3px; color: #ece8e0; margin-bottom: 20px; }
        .hero-sub { font-size: 15px; font-weight: 300; color: #52524e; letter-spacing: 0.3px; margin-bottom: 52px; }
        .input-row { display: flex; gap: 10px; margin-bottom: 16px; }
        .ticker-field { flex: 1; background: #0b0e18; border: 1px solid #161924; border-radius: 3px; padding: 15px 20px; font-family: 'JetBrains Mono', monospace; font-size: 20px; font-weight: 600; letter-spacing: 4px; color: #ece8e0; text-transform: uppercase; outline: none; transition: border-color 0.2s; }
        .ticker-field::placeholder { color: #1e2230; letter-spacing: 4px; }
        .ticker-field:focus { border-color: #2d6a4f; }
        .build-btn { background: #0d2018; border: 1px solid #1e4030; border-radius: 3px; padding: 15px 28px; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; letter-spacing: 2.5px; text-transform: uppercase; color: #4ade80; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
        .build-btn:hover:not(:disabled) { background: #112a1e; border-color: #2a5040; }
        .build-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .chips { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 72px; }
        .chip { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 2px; color: #2a3a30; border: 1px solid #111820; border-radius: 2px; padding: 5px 10px; cursor: pointer; transition: all 0.15s; }
        .chip:hover { color: #4a8a60; border-color: #1e2e28; }
        .loading-state { display: flex; flex-direction: column; align-items: center; gap: 20px; padding: 80px 0; }
        .dots { display: flex; gap: 7px; }
        .dot { width: 7px; height: 7px; background: #1e4030; border-radius: 50%; animation: blink 1.5s ease-in-out infinite; }
        .dot:nth-child(2) { animation-delay: 0.25s; }
        .dot:nth-child(3) { animation-delay: 0.5s; }
        @keyframes blink { 0%, 80%, 100% { transform: scale(1); opacity: 0.3; } 40% { transform: scale(1.5); opacity: 1; background: #4ade80; } }
        .loading-label { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #2d6a4f; letter-spacing: 1.5px; animation: fadeMsg 0.4s ease; }
        @keyframes fadeMsg { from { opacity: 0; } to { opacity: 1; } }
        .error-box { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #f87171; padding: 20px; border: 1px solid #200e0e; border-radius: 3px; background: #0a0606; }
        .analysis { animation: rise 0.5s ease; }
        @keyframes rise { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
        .co-header { padding-bottom: 36px; margin-bottom: 52px; border-bottom: 1px solid #0f1218; }
        .co-meta { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 2.5px; color: #2d6a4f; text-transform: uppercase; margin-bottom: 10px; }
        .co-name { font-family: 'Cormorant Garamond', serif; font-size: 42px; font-weight: 700; color: #ece8e0; line-height: 1.1; margin-bottom: 10px; }
        .co-desc { font-size: 14px; font-weight: 300; color: #48484a; line-height: 1.7; max-width: 560px; margin-bottom: 24px; }
        .co-stats { display: flex; gap: 28px; flex-wrap: wrap; }
        .stat { display: flex; flex-direction: column; gap: 4px; }
        .stat-lbl { font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: 2px; color: #30303a; text-transform: uppercase; }
        .stat-val { font-family: 'JetBrains Mono', monospace; font-size: 17px; font-weight: 500; color: #a0a098; }
        .section-tag { font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: 3px; text-transform: uppercase; color: #30303a; margin-bottom: 20px; }
        .scorecard { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 60px; }
        @media (max-width: 560px) { .scorecard { grid-template-columns: 1fr; } }
        .score-card { background: #09090f; border: 1px solid #0f1018; border-radius: 3px; padding: 18px 20px; }
        .score-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .score-metric { font-size: 12px; font-weight: 500; color: #7a7a74; }
        .score-num { font-family: 'JetBrains Mono', monospace; font-size: 24px; font-weight: 600; }
        .score-track { height: 2px; background: #141420; border-radius: 1px; margin-bottom: 8px; overflow: hidden; }
        .score-fill { height: 100%; border-radius: 1px; }
        .score-tag { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 1px; margin-bottom: 6px; }
        .score-note-text { font-size: 11px; color: #3a3a40; line-height: 1.6; }
        .pitch-pair { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 48px; }
        @media (max-width: 660px) { .pitch-pair { grid-template-columns: 1fr; } }
        .pitch-block { background: #09090f; border: 1px solid #0f1018; border-radius: 3px; padding: 24px; }
        .pitch-type-tag { font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 12px; }
        .bull-tag { color: #4ade80; }
        .bear-tag { color: #f87171; }
        .pitch-hl { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 700; color: #d4d0c8; line-height: 1.25; margin-bottom: 14px; padding-bottom: 14px; border-bottom: 1px solid #0f1018; }
        .pitch-copy { font-size: 12px; line-height: 1.9; color: #48484a; white-space: pre-line; }
        .verdict-block { background: #09090f; border: 1px solid #0f1018; border-radius: 3px; padding: 28px 32px; display: flex; gap: 28px; align-items: center; }
        .rating-col { display: flex; flex-direction: column; align-items: center; gap: 6px; flex-shrink: 0; }
        .rating-word { font-family: 'JetBrains Mono', monospace; font-size: 26px; font-weight: 600; letter-spacing: 3px; }
        .price-target { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #2d3840; letter-spacing: 1px; }
        .verdict-sep { width: 1px; height: 60px; background: #0f1218; flex-shrink: 0; }
        .verdict-text { font-size: 14px; font-weight: 300; line-height: 1.75; color: #6a6a64; flex: 1; }
        .disclaimer { margin-top: 48px; font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #1e1e24; letter-spacing: 0.5px; line-height: 1.7; border-top: 1px solid #0c0c12; padding-top: 24px; }
      `}</style>

      <div className="wrap">
        <div className="wordmark">Thesis</div>
        <h1 className="hero-title">Know what<br />you own.</h1>
        <p className="hero-sub">AI-powered stock analysis. Bull case. Bear case. Verdict.</p>

        <div className="input-row">
          <input className="ticker-field" placeholder="AAPL" value={ticker} onChange={(e) => setTicker(e.target.value)} onKeyDown={(e) => e.key === "Enter" && analyze()} maxLength={8} />
          <button className="build-btn" onClick={analyze} disabled={loading || !ticker.trim()}>Build Pitch →</button>
        </div>

        <div className="chips">
          {["META", "NVDA", "TSLA", "AMZN", "MSFT", "GOOG", "BRKB"].map((t) => (
            <span key={t} className="chip" onClick={() => setTicker(t)}>{t}</span>
          ))}
        </div>

        {loading && (
          <div className="loading-state">
            <div className="dots"><div className="dot" /><div className="dot" /><div className="dot" /></div>
            <div className="loading-label" key={loadingMsg}>{loadingMsg}</div>
          </div>
        )}

        {error && <div className="error-box">{error}</div>}

        {analysis && !loading && (
          <div className="analysis">
            <div className="co-header">
              <div className="co-meta">{analysis.company.sector} · {analysis.company.ticker}</div>
              <div className="co-name">{analysis.company.name}</div>
              <p className="co-desc">{analysis.company.description}</p>
              <div className="co-stats">
                <div className="stat"><span className="stat-lbl">Price</span><span className="stat-val">{analysis.company.currentPrice}</span></div>
                <div className="stat"><span className="stat-lbl">Mkt Cap</span><span className="stat-val">{analysis.company.marketCap}</span></div>
                <div className="stat"><span className="stat-lbl">P / E</span><span className="stat-val">{analysis.company.peRatio}</span></div>
              </div>
            </div>

            <div className="section-tag">Scorecard</div>
            <div className="scorecard">
              {analysis.scorecard.map((item, i) => (
                <div className="score-card" key={i}>
                  <div className="score-top">
                    <span className="score-metric">{item.metric}</span>
                    <span className="score-num" style={{ color: scoreColor(item.score) }}>{item.score}</span>
                  </div>
                  <div className="score-track"><div className="score-fill" style={{ width: `${item.score * 10}%`, background: scoreColor(item.score) }} /></div>
                  <div className="score-tag" style={{ color: scoreColor(item.score) }}>{item.label}</div>
                  <div className="score-note-text">{item.note}</div>
                </div>
              ))}
            </div>

            <div className="section-tag">The Thesis</div>
            <div className="pitch-pair">
              <div className="pitch-block">
                <div className="pitch-type-tag bull-tag">Bull Case</div>
                <div className="pitch-hl">{analysis.bullCase.headline}</div>
                <div className="pitch-copy">{analysis.bullCase.body}</div>
              </div>
              <div className="pitch-block">
                <div className="pitch-type-tag bear-tag">Bear Case</div>
                <div className="pitch-hl">{analysis.bearCase.headline}</div>
                <div className="pitch-copy">{analysis.bearCase.body}</div>
              </div>
            </div>

            <div className="section-tag">Verdict</div>
            <div className="verdict-block">
              <div className="rating-col">
                <div className="rating-word" style={{ color: ratingColor(analysis.verdict.rating) }}>{analysis.verdict.rating}</div>
                <div className="price-target">{analysis.verdict.priceTarget}</div>
              </div>
              <div className="verdict-sep" />
              <div className="verdict-text">{analysis.verdict.summary}</div>
            </div>

            <div className="disclaimer">Not financial advice. Thesis generates AI-powered analysis for educational purposes only. Always do your own research before making investment decisions.</div>
          </div>
        )}
      </div>
    </>
  );
}
