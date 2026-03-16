export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { ticker } = req.body;
  if (!ticker) return res.status(400).json({ error: "No ticker provided" });

  const PROMPT = `You are a senior equity analyst at a top investment firm. Analyze the stock: ${ticker.toUpperCase().trim()}

Use your knowledge of this company's financials, recent earnings, competitive position, and market dynamics to generate a rigorous analysis.

Return ONLY a valid JSON object — no markdown, no backticks, no preamble — with this exact structure:
{
  "company": {
    "name": "Full legal company name",
    "ticker": "TICKER",
    "sector": "Sector",
    "currentPrice": "$XXX.XX",
    "marketCap": "$X.XT",
    "peRatio": "XX.X",
    "description": "One precise sentence about what the company does and how it makes money"
  },
  "scorecard": [
    { "metric": "Revenue Growth", "score": 7, "label": "Strong", "note": "Specific note with numbers" },
    { "metric": "Profitability", "score": 8, "label": "Healthy", "note": "Specific note with margins or figures" },
    { "metric": "Valuation", "score": 5, "label": "Fairly Valued", "note": "Note referencing actual multiples" },
    { "metric": "Competitive Moat", "score": 9, "label": "Wide", "note": "Specific moat sources" },
    { "metric": "Balance Sheet", "score": 7, "label": "Solid", "note": "Debt/cash specifics" },
    { "metric": "Growth Outlook", "score": 6, "label": "Moderate", "note": "Forward catalysts or risks" }
  ],
  "bullCase": {
    "headline": "Sharp, specific headline for the bull case (not generic)",
    "body": "Three substantive paragraphs separated by newlines. Analyst-grade writing. Cite actual figures, margins, market size, competitive dynamics, and specific catalysts. No filler."
  },
  "bearCase": {
    "headline": "Sharp, specific headline for the bear case",
    "body": "Three substantive paragraphs separated by newlines. Cite real risks — regulatory, competitive, valuation, execution. Be direct and specific."
  },
  "verdict": {
    "rating": "BUY",
    "priceTarget": "$XXX",
    "summary": "Two sentences. Clear stance. Reference the most important factor driving the recommendation."
  }
}

Scores are 1–10. Write like a professional analyst, not a chatbot.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: PROMPT }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 2000 },
        }),
      }
    );

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    res.status(200).json(parsed);
  } catch (e) {
    res.status(500).json({ error: "Analysis failed. Check ticker and try again." });
  }
}
