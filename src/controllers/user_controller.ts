import { Request, Response } from "express";
import userModel, {iUser} from "../models/user_model"; // Import the user model
import BaseController from "./base_controller";
import { Model } from "mongoose";

class UserController extends BaseController<iUser> {
    constructor(model: Model<iUser>) {
        super(model);
    }
}

export default new UserController(userModel);