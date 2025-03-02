import express, { Request, Response } from 'express';
const router = express.Router();
import postController from '../controllers/post_controller';
import { authMiddleware } from '../controllers/auth_controller';

/**
* @swagger
* tags:
*   name: Posts
*   description: The Posts API
*/

/**
* @swagger
* /posts:
*   get:
*     summary: Get all posts
*     description: Retrieve all posts
*     tags: [Posts]
*     responses:
*       200:
*         description: Posts retrieved successfully
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 type: object
*                 properties:
*                   postPic:
*                     type: string
*                   content:
*                     type: string
*                   sender:
*                     type: string
*                   _id:
*                     type: string
*       400:
*         description: Error getting posts
*/
router.get("/", (req: Request, res: Response) => {
    postController.getAll(req, res);
});

/**
* @swagger
* /posts/{id}:
*   get:
*     summary: Get a post by ID
*     tags: [Posts]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*     responses:
*       200:
*         description: Post retrieved successfully
*       404:
*         description: Post not found
*       400:
*         description: Error getting post
*/
router.get("/:id", (req: Request, res: Response) => {
    postController.getById(req, res);
});

/**
* @swagger
* /posts:
*   post:
*     summary: Add a new post
*     tags: [Posts]
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
*                 postPic:
*                   type: string
*                   description: URL of the post image
*                   example: "https://example.com/image.jpg"
*                 content:
*                   type: string
*                   description: Post text content
*                   example: "This is my first post!"
*     responses:
*       201:
*         description: Post created successfully
*       400:
*         description: error creating post
*/
router.post("/", authMiddleware, postController.createItem.bind(postController));


//no need to swagger because the use of this route is internal
router.post("/challenge", postController.createItem.bind(postController));

/**
* @swagger
* /posts/{id}:
*   put:
*     summary: Update post
*     tags: [Posts]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*     requestBody:
*       required: false
*       content:
*         application/json:
*           schema:
*               type: object
*               properties:
*                 content:
*                   type: string
*                 postPic:
*                   type: string
*     responses:
*       200:
*         description: Post updated successfully
*       401:
*         description: Unauthorized
*       400:
*         description: Error in post update
* */
router.put("/:id", authMiddleware, (req, res) => {
    postController.updateById(req, res);
});

/**
* @swagger
* /posts/{id}:
*   delete:
*     summary: Delete post
*     tags: [Posts]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*     responses:
*       200:
*         description: Post deleted successfully
*       401:
*         description: Unauthorized
*       400:
*         description: Post not found
*/
router.delete("/:id", authMiddleware, postController.deleteItem.bind(postController));

export default router;
