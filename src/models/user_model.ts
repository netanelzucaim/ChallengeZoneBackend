import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export interface iUser {
  username: string,
  displayName?: string,
  password: string,
  _id?: string,
  refreshTokens?: string[],
  avatar?: string,
}

const userSchema = new Schema<iUser>({
  username: {
    type: String,
    required: true,
    unique: true
  },
  displayName: {
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
  }
});

const User = mongoose.model<iUser>("User", userSchema);
export default User;