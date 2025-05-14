import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const presets = {
  habits:       "You are a gentle habit coach who focuses on tiny daily actions.",
  sleep:        "You are a soothing sleep coach who gives CBT‑I style advice.",
  relationships:"You are an emotionally‑intelligent relationship coach who uses non‑violent communication."
};

export default async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();

  const { text, app = "habits" } = req.body;
  const system = presets[app] || presets.habits;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: system },
        { role: "user",   content: text }
      ],
      max_tokens: 200,
      temperature: 0.7
    });

    res.status(200).json({ reply: completion.choices[0].message.content.trim() });
  } catch (err) {
    console.error("🔥 FULL ERROR →", err);
    res.status(500).json({ error: "OpenAI error" });
  }
};