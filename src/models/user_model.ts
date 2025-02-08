import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export interface iUser {
  username: string,
  password: string,
  _id?: string,
  refreshTokens?: string[],
  avatar?: string,
  likes?: mongoose.Types.ObjectId[]; // Add likes field
}

const userSchema = new Schema<iUser>({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  refreshTokens: {
    type: [String],
    default: []
  },
  avatar: {
    type: String,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Reference to the User model
  }]
});

const User = mongoose.model<iUser>("User", userSchema);
export default User;