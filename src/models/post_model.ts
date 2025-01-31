import mongoose from "mongoose";

export interface iPost {
    title: string;
    sender: string;
    content: string;
  }
  

const Schema = mongoose.Schema;
const postSchema = new Schema<iPost>({
    title:{
        type: String, 
        required: true
    },  sender: {
        type: String,
        required: true
    }, content: {
        type: String,
        required: true
    }
});

const postModel = mongoose.model<iPost>("Post", postSchema);
export default postModel