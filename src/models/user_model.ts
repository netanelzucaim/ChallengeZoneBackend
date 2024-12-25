import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },password: {
        type: String,
        required: true
    }, refreshTokens: {
        type: [String],
        default: []
  }});


const Comments = mongoose.model("User", userSchema);
export default Comments; 