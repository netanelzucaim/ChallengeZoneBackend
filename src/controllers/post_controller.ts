//get all posts from database
import postModel, { iPost } from "../models/post_model";
import { Model } from "mongoose";
import {Request,Response} from "express"
import BaseController from "./base_controller";

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
}


export default new PostController(postModel)