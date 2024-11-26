const express = require('express');
const router  = express.Router();
const post = require('../controllers/post');

router.get("/:id",post.getPostById);
router.post("/",post.createPost);
router.get("/",post.getPosts);
router.put("/:id", post.updatePostById);

module.exports = router;