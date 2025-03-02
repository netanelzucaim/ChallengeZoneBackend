import express, { Request, Response } from 'express';
const router = express.Router();
import userController from '../controllers/user_controller';
import {authMiddleware} from '../controllers/auth_controller';


/**
* @swagger
* tags:
*   name: Users
*   description: The Users API
*/



/**
* @swagger
* /users:
*   get:
*     summary: Get all users
*     description: Retrieve all users
*     tags: [Users]
*     responses:
*       200:
*         description: users retrieved successfully
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 type: object
*                 properties:
*                   username:
*                     type: string
*                   displayName:
*                     type: string
*                   _id:
*                     type: string
*       400:
*         description: Error getting users
*/


router.get("/", (req: Request, res: Response) => {
    userController.getAll(req, res);
});


/**
* @swagger
* /users/{id}:
*   get:
*     summary: Get a user by ID
*     description: Retrieve a user by its ID
*     tags: [Users]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The ID of the user to retrieve
*     responses:
*       200:
*         description: User retrieved successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 username:
*                   type: string
*                 displayName:
*                   type: string
*                 _id:
*                   type: string
*       404:
*         description: Comment not found
*       400:
*         description: Error getting comment
*/
router.get("/:id",(req: Request, res: Response) =>{
    userController.getById(req,res)
});

/**
* @swagger
* /users/{id}:
*   put:
*     summary: Update user
*     description: Update a displayName by its ID
*     security:
*       - bearerAuth: []
*     tags: [Users]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The ID of the user to update
*     requestBody:
*       required: false
*       content:
*         application/json:
*           schema:
*               type: object
*               properties:
*                       diaplayName:
*                           type: string
*                           description: the new displayName updated
*                           example: "This is my displatName updated"
*     responses:
*       200:
*         description: The displayName of the user was successfully updated
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                       username:
*                           type: string
*                           description: the username
*                           example: "reuven@gmail.com"
*                       displayName:
*                           type: string
*                           description: the user displayName
*                           example: "rubi"
*                       _id:
*                           type: string
*                           description: the comment id
*                           example: "60f3b4b3b3b3b3b3b3b3b3"
*       400:
*         description: Error in user update
*/
router.put("/:id",authMiddleware,(req,res) =>{
    userController.updateById(req,res)
});

export default router;