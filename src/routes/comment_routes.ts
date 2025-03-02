import express, { Request, Response } from 'express';
const router  = express.Router();
import commentController from '../controllers/comment_controller';
import {authMiddleware} from '../controllers/auth_controller';


/**
* @swagger
* tags:
*   name: Comments
*   description: The Comments API
*/



/**
* @swagger
* /comments:
*   get:
*     summary: Get all comments
*     description: Retrieve all comments
*     tags: [Comments]
*     responses:
*       200:
*         description: Comments retrieved successfully
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 type: object
*                 properties:
*                   postId:
*                     type: string
*                   comment:
*                     type: string
*                   sender:
*                     type: string
*                   _id:
*                     type: string
*                   createdAt:
*                     type: string
*       400:
*         description: Error getting comments
*/



router.get("/", (req: Request, res: Response) => {
    commentController.getAll(req, res);
});


/**
* @swagger
* /comments/{id}:
*   get:
*     summary: Get a comment by ID
*     description: Retrieve a comment by its ID
*     tags: [Comments]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The ID of the comment to retrieve
*     responses:
*       200:
*         description: Comment retrieved successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 postId:
*                   type: string
*                 comment:
*                   type: string
*                 sender:
*                   type: string
*                 _id:
*                   type: string
*       404:
*         description: Comment not found
*       400:
*         description: Error getting comment
*/
router.get("/:id",(req: Request, res: Response) =>{
    commentController.getById(req,res)
});


/**
* @swagger
* /comments:
*   post:
*     summary: add a new comment
*     tags: [Comments]
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*               type: object
*               properties:
*                       postId:
*                           type: string
*                           description: the post id 
*                           example: "60f3b4b3b3b3b3b3b3b3b3"
*                       comment:
*                           type: string
*                           description: the comment content
*                           example: "This is my first comment ....."
*                       sender:
*                           type: string
*                           description: the comment's sender id
*                           example: "60f3b4b3b3b3b3b3b3b3b3"
*     responses:
*       201:
*         description: The comment was successfully created
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                       postId:
*                           type: string
*                           description: the post id 
*                           example: "60f3b4b3b3b3b3b3b3b3b3"
*                       comment:
*                           type: string
*                           description: the comment content
*                           example: "This is my first comment ....."
*                       sender:
*                           type: string
*                           description: the comment's sender id
*                           example: "60f3b4b3b3b3b3b3b3b3b3"
*                       _id:
*                           type: string
*                           description: the post id
*                           example: "60f3b4b3b3b3b3b3b3b3b3"
*       400:
*         description: error creating comment
*/

router.post("/",authMiddleware,commentController.createItem.bind(commentController));

/**
* @swagger
* /comments/{id}:
*   put:
*     summary: Update comment
*     description: Update a comment by its ID
*     security:
*       - bearerAuth: []
*     tags: [Comments]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The ID of the comment to update
*     requestBody:
*       required: false
*       content:
*         application/json:
*           schema:
*               type: object
*               properties:
*                       comment:
*                           type: string
*                           description: the comment content updated
*                           example: "This is my comment updated"
*     responses:
*       200:
*         description: The comment was successfully updated
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                       postId:
*                           type: string
*                           description: the post id 
*                           example: "60f3b4b3b3b3b3b3b3b3b3"
*                       comment:
*                           type: string
*                           description: the comment content
*                           example: "This is my first comment ....."
*                       sender:
*                           type: string
*                           description: the comment's sender id
*                           example: "60f3b4b3b3b3b3b3b3b3b3"
*                       _id:
*                           type: string
*                           description: the comment id
*                           example: "60f3b4b3b3b3b3b3b3b3b3"
*       400:
*         description: Error in comment update
*       401:
*         description: Unauthorized
*       403:
*         description: Invalid token
*/
router.put("/:id",authMiddleware,(req,res) =>{
    commentController.updateById(req,res)
});
/**
* @swagger
* /comments/{id}:
*   delete:
*     summary: Delete a comment
*     description: Delete a comment by its ID
*     security:
*       - bearerAuth: []
*     tags: [Comments]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The ID of the comment to delete
*     responses:
*       200:
*         description: Comment deleted successfully
*       400:
*         description: Comment not found
*       403:
*         description: Invalid token
*/
router.delete("/:id",authMiddleware, commentController.deleteItem.bind(commentController));

export default router;