import { Request, Response } from "express";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.AI_SECRET_KEY, // ודא שהמפתח מוגדר בקובץ .env
});

const getChatResponse = async (req: Request, res: Response) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: "messages array is required" });
      return;
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // שנה למודל המתאים לך
      messages: messages,
    });

    const theResponse = completion.choices[0]?.message?.content || "";

    res.status(200).json({ output: theResponse });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error calling Groq API:", error.message);
      res.status(500).json({ error: "Failed to get response from Groq", details: error.message });
    } else {
      console.error("Unexpected error:", error);
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
};

const getChatResponseRaw = async (req: Request, res: Response) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: "messages array is required" });
      return;
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // שנה למודל המתאים לך
      messages: messages,
    });

    return completion.choices[0]?.message?.content || "";
  } catch (error: unknown){
    console.error("Unexpected error:", error);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
};

export default { getChatResponse, getChatResponseRaw };
