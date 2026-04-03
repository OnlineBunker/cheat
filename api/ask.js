import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const question = req.method === "POST" ? req.body?.q : req.query?.q;

  if (!question) {
    return res.status(400).json({ error: "No question provided" });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent(
      "Explain this in simple, normal English without headings or formatting or give me the direct code :\n\n" +
        question,
    );

    return res.status(200).json({
      answer: result.response.text(),
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
}
