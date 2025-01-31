import express, { Request, Response } from "express";
import authController from "../controllers/auth_controller";

const router = express.Router();


/**
* @swagger
* tags:
*   name: Auth
*   description: The Authentication API
*/

/**
* @swagger
* components:
*   securitySchemes:
*     bearerAuth:
*       type: http
*       scheme: bearer
*       bearerFormat: JWT
*/

/**
* @swagger  
* components:
*   schemas:
*     User:
*       type: object
*       required:
*         - email
*         - password
*       properties:
*         email:
*           type: string
*           description: The user email
*         password:
*           type: string
*           description: The user password
*       example:
*         email: 'bob@gmail.com'
*         password: '123456'
*/


/**
* @swagger
* /auth/register:
*   post:
*     summary: registers a new user
*     tags: [Auth]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/User'
*     responses:
*       201:
*         description: Registration success, return the new user
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/User'
*
*       400:
*         description: Registration failed
*/
router.post("/register", authController.register);

/**
* @swagger
* /auth/login:
*   post:
*     summary: Authenticate a user and return access and refresh tokens.
*     tags: [Auth]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/User'
*     responses:
*       200:
*         description: Successful login
*         content:
*           application/json:
*               schema:
*                   type: object
*                   properties:
*                       email:
*                           type: string
*                           description: User email
*                           example: "nati@gmail.com"
*                       accessToken:
*                           type: string
*                           description: JWT access token
*                           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
*                       refreshToken:
*                           type: string
*                           description: JWT refresh token
*                           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
*                       _id:
*                           type: string
*                           description: User ID
*                           example: "60d0fe4f5311236168a109ca"
*       '400':
*         description: Invalid email or password
*       '500':
*         description: Internal server error
*/
router.post("/login", authController.login);
/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout a user and invalidate the refresh token
 *     tags: [Auth] 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token to invalidate
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: Logout successful
 *       400:
 *         description: Invalid token or missing refresh token
 *       403:
 *         description: Invalid token
 */
router.post("/logout", authController.logout);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh the access token using the refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token to use for generating a new access token
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: New access and refresh tokens generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: New JWT access token
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 refreshToken:
 *                   type: string
 *                   description: New JWT refresh token
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Invalid refresh token or missing refresh token
 *       403:
 *         description: Invalid token
 */
router.post("/refresh", authController.refresh);

export default router;