const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const postSchema = new Schema({
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

const Posts = mongoose.model("Post", postSchema);
module.exports = Posts;