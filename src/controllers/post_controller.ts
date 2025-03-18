import { Request, response, Response } from "express";
import postModel, { iPost } from "../models/post_model";
import commentModel from "../models/comment_model"; // Import the comment model
import groqController from "./groq_controller"; // Import the groq model
import BaseController from "./base_controller";
import { Model } from "mongoose";
import cron from "node-cron";
import axios from "axios";
import * as fs from 'node:fs'
import path from "path";


class PostController extends BaseController<iPost> {
    constructor(model: Model<iPost>) {
        super(model);
    }

    async createItem(req: Request, res: Response) {
        try {
            const _id = req.body.sender || req.query.userId; //req.body.sender is for the challengeZone cron
            const post = {
                ...req.body,
                sender: _id
            };
            req.body = post;
            return super.createItem(req, res);
        } catch (error) {
            console.error("Error creating post:", error);
            res.status(400).send(error);
        }
    }

    // async getPostsWithAvatarUrlByUser(req: Request, res: Response) {
    //     try {
    //         const userId = req.query.userId;
    //         const posts = await this.model.find({ sender: userId });
    //         const postsWithAvatar = await Promise.all(posts.map(async post => {
    //             const user = await userModel.findOne({ _id: post.sender });
    //             return {
    //                 ...post.toObject(),
    //                 avatarUrl: user ? user.avatar : null
    //             };
    //         }));
    //         res.status(200).send(postsWithAvatar);
    //     } catch (err) {
    //         res.status(400).send(err);
    //     }
    // }

    async addCommentToPost(req: Request, res: Response) {
        try {
            const { postId, commentId } = req.body;
            await postModel.findByIdAndUpdate(
                postId,
                { $push: { comments: commentId } },
                { new: true }
            );
            // Do not send a response here, let the calling function handle it
        } catch (error) {
            res.status(400).send(error);
        }
    }

    async deleteItem(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        try {
            // Find the post by ID
            const post = await this.model.findById(id);
            if (!post) {
                res.status(404).send("Post not found");
                return;
            }

            // Delete all comments associated with the post
            await commentModel.deleteMany({ _id: { $in: post.comments } });


            // Check if there is an image attached to the post and delete it
            if (post.postPic) {
                const imageFileName = post.postPic.split("/public/")[1];
                const imagePath = path.join(__dirname, "../..", "public", imageFileName); // Assuming 'image' contains the image file path
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath); // Delete the file
                }
            }


            // Delete the post
            await this.model.findByIdAndDelete(id);



            res.status(200).send("Post and associated comments deleted successfully");
        } catch (err) {
            res.status(400).send(err);
        }
    }


    async addChallenge() {
        try {
            console.log("Fetching AI-generated fitness challenge...");

            const aiResponse = await groqController.getChatResponseRaw({
                body: { messages: [{ role: "user", content: "give me a challenging exercise in the gym or in street workout. Please be short and simple in your answer." }] }
            } as Request, {} as Response);

            console.log(aiResponse);

            const response = await axios.post("http://127.0.0.1:3060/posts/challenge", {
                sender: process.env.Challeng_Zone_UserID,
                content: aiResponse,
            });

            console.log("Post created successfully:", response.data);
        } catch (error) {
            console.error("Error generating AI fitness challenge post:", error);
            response.status(500).json({ error: "Internal server error" });
        }
    }
}
const postControllerInstance = new PostController(postModel);

// generate a new challenge every hour
cron.schedule("0 * * * *", () => {
    postControllerInstance.addChallenge();
});

export default new PostController(postModel);