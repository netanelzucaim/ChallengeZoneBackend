import mongoose from "mongoose";

export interface iPost {
    postPic: string;
    sender: string;
    content: string;
}


const Schema = mongoose.Schema;
const postSchema = new Schema<iPost>({
    postPic: {
        type: String,
        required: false
    }, sender: {
        type: String,
        required: true
    }, content: {
        type: String,
        required: true
    }
});

const postModel = mongoose.model<iPost>("Post", postSchema);
export default postModel