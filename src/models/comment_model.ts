import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export interface iComment {
    sender: mongoose.Types.ObjectId; // Change to ObjectId type and reference User model
    comment: string;
    postId: mongoose.Types.ObjectId; // Change to ObjectId type
}

const commentSchema = new Schema<iComment>({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post', // Reference to the Post model
        required: true,
    }
});

const Comment = mongoose.model<iComment>("Comment", commentSchema);
export default Comment;