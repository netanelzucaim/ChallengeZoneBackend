//get all posts from database
import {Request,Response} from "express"
import { Model } from "mongoose";


class BaseController<T> {
    model: Model<T>;
    constructor(model: any){
        this.model = model;
    }
    async getAll(req: Request, res: Response) {
        const filter = req.query;
        console.log(filter);
        try {
          
            const data = await this.model.find(filter as any);
            return res.send(data);
        } catch (err) {
            return res.status(400).send(err);
        }
    };
    async getById(req: Request, res: Response) {
        const id = req.params.id;
        if (id) {
          try {
            const data = await this.model.findById(id);
            if (data) {
              return res.send(data);
            } else {
              return res.status(404).send("item not found");
            }
          } catch (err) {
            return res.status(400).send(err);
          }
        }
        return res.status(400).send("invalid id");
      };
    

    async updateById (req: Request,res:Response) {
        const id = req.params.id;
        const updateData = req.body;
        try {
            const data = await this.model.findByIdAndUpdate(id, updateData, { new: true });
            if (data) {
                return res.status(200).send(data);
            } else {
                return res.status(404).send("Item not found");
            }
        } catch (err) {
            return res.status(400).send(err);
        }
    };

    async createItem(req: Request,res:Response) {
        try {
            const data = await this.model.create(req.body);
            res.status(201).send(data);
        } catch (err) {
            res.status(400).send(err);
        }
    };

    async deleteItem (req: Request,res:Response) {
        const id = req.params.id;
        try {
            await this.model.findByIdAndDelete(id);
            res.status(200).send("deleted successfully");
        } catch (err) {
            res.status(400).send(err);
        }
    };
}
//TO DO: understand what to export - they both or just one?
export const createController = <T>(model:Model<T>)=>{
return new BaseController(model);
}
export default BaseController

