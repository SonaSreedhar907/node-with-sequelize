const errorHandler = require("../utils/errorHandler");
const { db } = require("../models");
const { Op } = require("sequelize");

const Post = db.models.Post;

const create = async (req, res, next) => {
    try {
      if (!req.body.title || !req.body.content) {
        return res
          .status(400)
          .json({ message: "Please fill all required fields" });
      }
      const existingPost = await Post.findOne({
        where: { title: req.body.title },
      });
      if (existingPost) {
        return res
          .status(400)
          .json({ message: "A post with the same title already exists" });
      }
      const slug = req.body.title
        .split(" ")
        .join("-")
        .toLowerCase()
        .replace(/[^a-zA-Z0-9-]/g, "");
      const newPost = await Post.create({
        ...req.body,
        slug,
        userId: req.user.id,
      });
      res.status(201).json(newPost);
    } catch (error) {
      console.error("Error in create controller:", error);
  
      // Customize the error response based on the error type
      if (error.name === "SequelizeValidationError") {
        // Handle validation errors
        const validationErrors = error.errors.map((err) => ({
          field: err.path,
          message: err.message,
        }));
        return res.status(400).json({ validationErrors });
      }
  
      // Handle other errors
      next(error);
    }
  };
  
const getposts = async (req, res, next) => {
  try {
    const posts = await Post.findAll();
    if (!posts || posts.length == 0) {
      return res.status(404).json({ message: "No Posts found" });
    }
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  const postId = req.params.postid;
//   console.log(postId);
//   console.log(req.params); // Check if params are correctly populated
//    console.log(req.url);    // Log the entire URL to ensure it's correct
  try {
    const post = await Post.findByPk(postId);
    console.log(post);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const postUserId = Number(post.userId);
    if (postUserId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this post" });
    }
    await post.destroy();
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const updatedPost = await Post.findByPk(postId);
    // console.log("hiiii", updatedPost);
    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    // Check if the user is authorized to update this post
    const postUserId = Number(updatedPost.userId);
    if (postUserId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this post" });
    }
    // Validate title and content
    const { creator, title, content, category, image } = req.body;
    if (
      (title && typeof title !== "string") ||
      (content && typeof content !== "string")
    ) {
      return res
        .status(400)
        .json({ message: "Title and content must be strings" });
    }
    // Check if the updated title already exists for another post
    const existingPostWithSameTitle = await Post.findOne({
      where: {
        title: title,
        id: { [Op.not]: postId }, // Exclude the current post being updated
      },
    });
    if (existingPostWithSameTitle) {
      return res
        .status(400)
        .json({ message: "Title already exists for another post" });
    }
    // Update the post with new values
    updatedPost.creator = creator || updatedPost.creator;
    updatedPost.title = title || updatedPost.title;
    updatedPost.content = content || updatedPost.content;
    updatedPost.category = category || updatedPost.category;
    updatedPost.image = image || updatedPost.image;
    // Save the updated post
    await updatedPost.save();
    res.status(200).json({ message: "Post updated successfully", updatedPost });
  } catch (error) {
    next(error);
  }
};

const getsposts = async (req, res, next) => {
  try {
    let searchQuery = req.query.q;

    if (!searchQuery) {
      const allPosts = await Post.findAll({
        include: [
          {
            model: db.models.User,
            as: 'creator', // Use the alias 'creator' instead of 'User'
            attributes: ['username'], // Specify the fields you want to include from the User model
            map: user => user.get('username'), // Map 'username' to 'creator'
          },
        ],
      });

      if (!allPosts || allPosts.length === 0) {
        return res.status(404).json({ message: 'No Posts found' });
      }

      // Iterate through each post to get the createdAt date
      const postsWithDate = allPosts.map(post => ({
        ...post.toJSON(),
        dateOfPosting: post.createdAt.toLocaleDateString(),
      }));

      return res.status(200).json(postsWithDate);
    }

    const searchResults = await Post.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${searchQuery}%` } },
          { content: { [Op.like]: `%${searchQuery}%` } },
        ],
      },
      include: [
        {
          model: db.models.User,
          as: 'creator',
          attributes: ['username'],
          map: user => user.get('username'),
        },
      ],
    });

    if (!searchResults || searchResults.length === 0) {
      return res.status(404).json({ message: 'No matching posts found' });
    }

    // Iterate through each search result to get the createdAt date
    const searchResultsWithDate = searchResults.map(result => ({
      ...result.toJSON(),
      dateOfPosting: result.createdAt.toLocaleDateString(),
    }));

    res.status(200).json(searchResultsWithDate);
  } catch (error) {
    console.error('Error in getsposts:', error);
    next(error);
  }
};    

  module.exports = { create, getposts, deletePost, updatePost, getsposts };
