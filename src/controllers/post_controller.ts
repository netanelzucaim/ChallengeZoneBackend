//get all posts from database
import postModel, { iPost } from "../models/post_model";
import { Model } from "mongoose";
import {Request,Response} from "express"
import BaseController from "./base_controller";
import userModel from "../models/user_model";   
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
    async getPostsWithAvatarUrl(req: Request, res: Response) {
        const filter = req.query;
        console.log(filter);
        try {
            const data = await this.model.find(filter as any);
            // return res.send(data);

            const postsWithAvatar = await Promise.all(data.map(async post => {
            const user = await userModel.findOne({ _id: post.sender });                return {
                    ...post.toObject(),
                    avatarUrl: user ? user.avatar : null
            };
            }));
            return res.send(postsWithAvatar);
        } catch (err) {
            return res.status(400).send(err);
        }
    
    }
}


export default new PostController(postModel)