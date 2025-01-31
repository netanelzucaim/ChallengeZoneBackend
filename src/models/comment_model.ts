import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export interface iComment{
    sender: string;
    comment: string;
    postId: string;
}
const commentSchema = new Schema<iComment>({
    sender: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true
    },
    postId: {
        type: String,
        required: true,
    }
  });


const Comments = mongoose.model<iComment>("Comment", commentSchema);
export default Comments; 