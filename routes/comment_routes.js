const express = require('express');
const router  = express.Router();
const comment = require('../controllers/comment');

router.delete("/delete/:id", comment.deleteComment);
router.post("/",comment.createComment);
router.get("/", comment.getComments);
router.get("/:id", comment.getCommentsByPostId);
router.put("/:id", comment.updateCommentById);

module.exports = router;