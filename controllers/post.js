//get all posts from database
const Posts = require("../models/post_model");

const getPosts = async (req,res) => {
    const query = req.query;
    console.log(query);
    try {
        if (query.sender){ 
        const postsOfSender = await Posts.find({sender: query.sender});
        console.log(postsOfSender);
        res.send(postsOfSender);
      } else {
        const posts = await Posts.find();
        console.log(posts);
        res.send(posts);      
      }        
    } catch(err){
        res.status(400).send(`${err.message} - make sure you attach sender id `)
    }
};

const getPostById = async (req,res) => {
    const id = req.params.id;
    console.log(req.body);
    if (id) {
        try{
            const post = await Posts.findById(id);
            if (post) {
                return res.send(post);
            } else {
                return res.status(404).send("Post not found");
            }
        } catch (err) {
            return res.status(400).send(err.message);
        }
    }
    return res.status(400).send(err.message);
};

const updatePostById = async (req, res) => {
    const id = req.params.id;
    console.log(req.body);
    try {
        const post = await Posts.findById(id);
        if (post) {
            post.content = req.body.content;
            await post.save();
            return res.status(200).send(post);
        } else {
            return res.status(404).send("Post not found");
        }
    } catch (err) {
        return res.status(400).send(err.message);
    }
};

const createPost = async (req,res) => {
    console.log(req.body);
    try {
        const post = await Posts.create(req.body);
        res.status(201).send(post);
    } catch (err) {
        res.status(400).send(err.message);
    }
};

module.exports = {getPosts,getPostById,updatePostById,createPost}