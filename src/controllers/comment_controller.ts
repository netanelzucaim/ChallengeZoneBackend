//get all posts from database
import commentModel, { iComment } from "../models/comment_model";
import { Model } from "mongoose";
import {Request,Response} from "express";
import BaseController from "./base_controller";
import postController from "./post_controller";
import postModel from "../models/post_model";
//Import the post controller

class CommentController extends BaseController<iComment> {
    constructor(model: Model<iComment>) {
        super(model);
    }

    async createItem(req: Request, res: Response) {
        try {
            const _id = req.query.userId;
            const comment = {
                ...req.body,
                sender: _id
            };

            req.body = comment;

            // Create the comment using the base controller's createItem method
            const newComment = await this.model.create(req.body);

            // Update the relevant post by pushing the new comment ID to the comments array
            if (newComment) {
                const postReq = {
                    body: {
                        postId: req.body.postId,
                        commentId: newComment._id
                    }
                } as Request;
                await postController.addCommentToPost(postReq, res);
            }
                res.status(201).send(newComment);
            } catch (error) {
                res.status(400).send(error);
        }
    }


    async deleteItem(req: Request, res: Response): Promise<void>{
        const id = req.params.id;
        try {
            // Find the comment by ID
            const comment = await this.model.findById(id);
            if (!comment) {
                 res.status(404).send("Comment not found");
            } else{

            // Delete the comment
            await this.model.findByIdAndDelete(id);

            // Remove the comment ID from the comments array in the associated post
            await postModel.findByIdAndUpdate(
                comment.postId,
                { $pull: { comments: id } },
                { new: true }
            );

             res.status(200).send("Comment and reference in post deleted successfully");
        } 
    }
    catch (err) {
             res.status(400).send(err);
        } 
    }
}

export default new CommentController(commentModel);