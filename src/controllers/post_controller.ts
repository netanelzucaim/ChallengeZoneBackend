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
        try {
            const posts = await postModel.find();
            const postsWithAvatar = await Promise.all(posts.map(async post => {
                const user = await userModel.findOne({ _id: post.sender });
                return {
                    ...post.toObject(),
                    avatarUrl: user ? user.avatar : null,
                    username: user ? user.username : null
                };
            }));
            res.status(200).send(postsWithAvatar);
        } catch (err) {
            res.status(400).send(err);
        }
    }
    async getPostsWithAvatarUrlByUser(req: Request, res: Response) {
        try {
            const userId = req.query.userId;
            const posts = await postModel.find({sender: userId });
            const postsWithAvatar = await Promise.all(posts.map(async post => {
                const user = await userModel.findOne({ _id: userId });
                return {
                    ...post.toObject(),
                    avatarUrl: user ? user.avatar : null,
                    username: user ? user.username : null
                };
            }));
            res.status(200).send(postsWithAvatar);
        } catch (err) {
            res.status(400).send(err);
        }
    }













}


export default new PostController(postModel)