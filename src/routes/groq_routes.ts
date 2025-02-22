// routes/chatRoutes.ts
import express from "express";
import groqController from "../controllers/groq_controller"; // קריאה לפונקציה מהקונטרולר

const router = express.Router();

// נתיב לפנייה ל-ChatGPT
router.post("/groq", groqController.getChatResponse);

export default router;
