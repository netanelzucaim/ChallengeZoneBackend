const Comments = require("../models/comment_model");
const Posts = require("../models/post_model");

const createComment = async (req,res) => {
    const id = req.body.postId;
    console.log(req.body.postId);
    try{
        const post = await Posts.findById(id);
        if (!post) {
          return res.status(404).send("Post not found");
        }
        const comment = await Comments.create(req.body);
        res.status(201).send(comment);
    } catch (err) {
    res.status(400).send(err.message);
    }
};

const getComments = async (req,res) => {
    try {
        const comments = await Comments.find();
        res.send(comments);              
    } catch(err){
        res.status(400).send(err.message);
    }
};


const getCommentsByPostId = async (req,res) => {
    const postId = req.params.id;
    if (postId) {
        try{
            const comments = await Comments.find({ postId: postId});
            if (comments.length > 0) {
                return res.send(comments);
            } else {
                return res.status(404).send("There are no comments found");
            }
        } catch (err) {
            return res.status(400).send(err.message);
        }
    }
    return res.status(400).send(err.message);
};

const deleteComment = async (req,res) => {
    try{
        const id = req.params.id; 
        const comment = await Comments.findById(id);
        if(!comment){
            res.status(200).send(`id ${id} does not exist`);
        } else {
            const comment = await Comments.findByIdAndDelete(id);
            res.status(200).send(`succesfully delete comment with id of ${id}`);
        }
    } catch (error) {   
        res.status(400).send(error.message);
    }
}

const updateCommentById = async (req, res) => {
    const commentId = req.params.id;
    try {
        const comment = await Comments.findById(commentId);
        if (comment) {
            comment.content = req.body.content;
            await comment.save();
            return res.status(200).send(comment);
        } else {
            return res.status(404).send("Comment not found");
        }
    } catch (err) {
        return res.status(400).send(err.message);
    }
};

module.exports = {getComments,getCommentsByPostId,createComment,deleteComment, updateCommentById}