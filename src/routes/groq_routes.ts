// routes/chatRoutes.ts
import express from "express";
import groqController from "../controllers/groq_controller"; 

const router = express.Router();

router.post("/groq", groqController.getChatResponse);

export default router;
