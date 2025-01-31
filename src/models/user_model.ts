import mongoose from 'mongoose';
const Schema = mongoose.Schema;
export interface iUser {
  username: string,
  password: string,
  _id?: string,
  refreshTokens?: string[],
  avatar?: string;
}
const userSchema = new Schema<iUser>({
  username: {
    type: String,
    required: true,
    unique: true
  }, password: {
    type: String,
    required: true
  }, refreshTokens: {
    type: [String],
    default: []
  }, avatar: {
    type: String,
  },
});


const Comments = mongoose.model("User", userSchema);
export default Comments; 