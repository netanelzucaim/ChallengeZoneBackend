import { Request, Response } from "express";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.AI_SECRET_KEY, 
});

const getChatResponse = async (req: Request, res: Response) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: "messages array is required" });
      return;
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", 
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

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

const getChatResponseCore = async (messages: ChatMessage[]) => {
  if (!messages || !Array.isArray(messages)) {
    throw new Error("messages array is required");
  }

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: messages,
  });

  return completion.choices[0]?.message?.content || "";
};

const getChatResponseRaw = async (req: Request, res: Response) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || !messages.every(msg => typeof msg.role === "string" && typeof msg.content === "string")) {
      return res.status(400).json({ error: "Invalid messages format" });
    }

    const theResponse = await getChatResponseCore(messages as ChatMessage[]);
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


export default { getChatResponse, getChatResponseRaw, getChatResponseCore };