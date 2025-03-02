// routes/chatRoutes.ts
import express from "express";
import groqController from "../controllers/groq_controller"; 

const router = express.Router();

/**
* @swagger
* tags:
*   name: groq
*   description: The AI API
*/

/**
* @swagger
* /ai/groq:
*   post:
*     summary: Get a response from the AI
*     tags: [groq]
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*               type: object
*               required: [content, sender]
*               properties:
*                 messages:
*                   type: array
*                   items:
*                     type: object
*                     properties:
*                       role:
*                         type: string
*                         description: URL of the post image
*                         example: "user"
*                       content:
*                         type: string
*                         description: Post text content
*                         example: "give me a name of a famous actor"
*     responses:
*       200:
*         description: answer retrieved successfully
*       400:
*         description: error creating post
*/
router.post("/groq", groqController.getChatResponse);

export default router;
