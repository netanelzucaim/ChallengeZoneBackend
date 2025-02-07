import { Request, Response } from "express";
import postModel, { iPost } from "../models/post_model";
import commentModel from "../models/comment_model"; // Import the comment model
import userModel from "../models/user_model"; // Import the user model
import BaseController from "./base_controller";
import { Model } from "mongoose";

class PostController extends BaseController<iPost> {
    constructor(model: Model<iPost>) {
        super(model);
    }

    async createItem(req: Request, res: Response) {
        try {
            const _id = req.query.userId;
            const post = {
                ...req.body,
                sender: _id
            };
            req.body = post;
            return super.createItem(req, res);
        } catch (error) {
            res.status(400).send(error);
        }   
    }

    // async getPostsWithAvatarUrl(req: Request, res: Response) {
    //     try {
    //         const posts = await this.model.find();
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

    async getPostsWithAvatarUrlByUser(req: Request, res: Response) {
        try {
            const userId = req.query.userId;
            const posts = await this.model.find({ sender: userId });
            const postsWithAvatar = await Promise.all(posts.map(async post => {
                const user = await userModel.findOne({ _id: post.sender });
                return {
                    ...post.toObject(),
                    avatarUrl: user ? user.avatar : null
                };
            }));
            res.status(200).send(postsWithAvatar);
        } catch (err) {
            res.status(400).send(err);
        }
    }

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

            // Delete the post
            await this.model.findByIdAndDelete(id);

            res.status(200).send("Post and associated comments deleted successfully");
        } catch (err) {
            res.status(400).send(err);
        }
    }
}

export default new PostController(postModel);