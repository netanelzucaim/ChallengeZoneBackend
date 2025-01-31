//get all posts from database
import commentModel, { iComment } from "../models/comment_model";
import { Model } from "mongoose";
import {Request,Response} from "express"
import BaseController from "./base_controller";

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
            return super.createItem(req, res);
        } catch (error) {
            res.status(400).send(error);
        }   
    }
}

export default new CommentController(commentModel)