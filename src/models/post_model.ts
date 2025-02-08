import mongoose from "mongoose";

export interface iPost {
    postPic: string;
    sender: mongoose.Types.ObjectId; // Change to ObjectId type and reference User model
    content: string;
    comments: mongoose.Types.ObjectId[]; // Add comments field
    likes?: mongoose.Types.ObjectId[]; // Add likes field
}

const Schema = mongoose.Schema;
const postSchema = new Schema<iPost>({
    postPic: {
        type: String,
        required: false
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    content: {
        type: String,
        required: true
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Reference to the User model
      }]
});

const postModel = mongoose.model<iPost>("Post", postSchema);
export default postModel;