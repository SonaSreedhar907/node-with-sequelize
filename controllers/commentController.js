const { db } = require("../models");
const Comment = db.models.Comment;
const Post = db.models.Post;
const User = db.models.User;

const createComment = async (req, res, next) => {
  try {
    const { content, postId  } = req.body;
    const userId = req.user.id;    //sigin person
    console.log('user is :',userId)
    const newComment = await db.models.Comment.create({
      content,
      postId,
      userId:userId    //signin person 
    });
    res.status(200).json(newComment);
  } catch (error) {
    next(error);
  }
};

const getPostComments = async (req, res, next) => {
  try {
    
    const postId = Number(req.params.postid);
    const post = await db.models.Post.findByPk(postId);
    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }
    const comments = await Comment.findAll({
      where: { postId },
      order: [["createdAt", "DESC"]],
      include:[
        {
          model : db.models.User,
          as : 'user', 
          attributes : ['username']
        },
        {
          model :db.models.Post,
          as : 'post',
          attributes : ['content']
        }
      ]
    });
    const commentData = comments.map(comment=>({
      id: comment.id,
      content: comment.content,
      postId: comment.postId,
      username: comment.user.username, // get the username from the associated user
      post: comment.post.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }))
    res.status(200).json(commentData);
  } catch (error) {
    next(error);
  }
};

const editComment = async (req, res, next) => {
  try {
    const comment = await Comment.findByPk(req.params.commentid);
    if (!comment) {
      res.status(404).json({ message: "Comment not found" });
    }
    if (!comment.userId || comment.userId !== req.user.id) {
      res
        .status(409)
        .json({ message: "You are not allowed to edit this comment" });
    }
    const [updatedRows] = await Comment.update(
      {
        content: req.body.content,
      },
      {
        returning: true,
        where: {
          id: req.params.commentid,
        },
      }
    );
    if (updatedRows === 0) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }
    const editedComment = await Comment.findByPk(req.params.commentid);
    if (!editedComment) {
      res.status(404).json({ message: "Comment not found" });
    }
    res.status(200).json(editedComment);
  } catch (error) {
    next(error);
  }
};


const deleteComment = async (req, res, next) => {
  try {
    const commentId = req.params.commentid;
    const userId = req.user.id;   
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(400).json({ message: "Comment not found" });
    }
    const post = await Post.findByPk(comment.postId,{
      attributes : ['id','userId']
    });
    console.log('hiii',post.userId)
    console.log('hello',comment.userId)
    console.log('zzzz',userId)
    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }
    // Check if the user is the creator of either the post or the comment
    if (post.userId != userId && comment.userId !== userId) {
      return res.status(403).json({ message: "You are not allowed to delete the comment" });
    }
    await Comment.destroy({
      where: { id: commentId },
    });
    res.status(200).json({ message: "Comment has been deleted" });
  } catch (error) {
    console.error('Error deleting comment:', error);
    next(error);
  }
};

module.exports = { createComment, getPostComments, deleteComment, editComment };
