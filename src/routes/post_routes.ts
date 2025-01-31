import express, { Request, Response } from 'express';
const router  = express.Router();
import postController from '../controllers/post_controller';
import {authMiddleware} from '../controllers/auth_controller';


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
*                   title:
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
*     description: Retrieve a post by its ID
*     tags: [Posts]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The ID of the post to retrieve
*     responses:
*       200:
*         description: Post retrieved successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 title:
*                   type: string
*                 content:
*                   type: string
*                 sender:
*                   type: string
*                 _id:
*                   type: string
*       404:
*         description: Post not found
*       400:
*         description: Error getting post
*/
router.get("/:id",(req: Request, res: Response) =>{
    postController.getById(req,res)
});

/**
* @swagger
* /posts:
*   post:
*     summary: add a new post
*     tags: [Posts]
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*               type: object
*               properties:
*                       title:
*                           type: string
*                           description: the post title
*                           example: "My first post"
*                       content:
*                           type: string
*                           description: the post content
*                           example: "This is my first post ....."
*     responses:
*       201:
*         description: The post was successfully created
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                       title:
*                           type: string
*                           description: the post title
*                           example: "My first post"
*                       content:
*                           type: string
*                           description: the post content
*                           example: "This is my first post ....."
*                       sender:
*                           type: string
*                           description: the post sender
*                           example: "60f3b4b3b3b3b3b3b3b3b3b3"
*                       _id:
*                           type: string
*                           description: the post id
*                           example: "60f3b4b3b3b3b3b3b3b3b3"
*       400:
*         description: error creating post
*/

router.post("/",authMiddleware,postController.createItem.bind(postController));

/**
* @swagger
* /posts/{id}:
*   put:
*     summary: Update post
*     description: Update a post by its ID
*     security:
*       - bearerAuth: []
*     tags: [Posts]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The ID of the post to update
*     requestBody:
*       required: false
*       content:
*         application/json:
*           schema:
*               type: object
*               properties:
*                       title:
*                           type: string
*                           description: the post title
*                           example: "My first post updated"
*                       content:
*                           type: string
*                           description: the post content
*                           example: "This is my first post updated ....."
*     responses:
*       200:
*         description: The post was successfully updated
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                       title:
*                           type: string
*                           description: the post title
*                           example: "My first post"
*                       content:
*                           type: string
*                           description: the post content
*                           example: "This is my first post ....."
*                       sender:
*                           type: string
*                           description: the post sender
*                           example: "60f3b4b3b3b3b3b3b3b3b3b3"
*                       _id:
*                           type: string
*                           description: the post id
*                           example: "60f3b4b3b3b3b3b3b3b3b3"
*       400:
*         description: Error in post update
*/
router.put("/:id",authMiddleware,(req,res) =>{
    postController.updateById(req,res)
});
/**
* @swagger
* /posts/{id}:
*   delete:
*     summary: Delete post
*     description: Delete a post by its ID
*     security:
*       - bearerAuth: []
*     tags: [Posts]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The ID of the post to delete
*     responses:
*       200:
*         description: Post deleted successfully
*       400:
*         description: Post not found
*/
router.delete("/:id",authMiddleware, postController.deleteItem.bind(postController));

export default router;