const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var commentSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },    content: {
        type: String,
        required: true,
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    }
  });


const Comments = mongoose.model("Comment", commentSchema);
module.exports = Comments; 