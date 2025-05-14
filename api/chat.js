import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();

  const { text, system } = req.body;

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
  } catch {
    res.status(500).json({ error: "OpenAI error" });
  }
};
} catch (err) {
  console.error('🔥 OpenAI error details:', err.response?.data || err.message || err);
  res.status(500).json({ error: "OpenAI error" });
}