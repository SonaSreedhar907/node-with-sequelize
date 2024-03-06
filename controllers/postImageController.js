const { db } = require('../models');
const Post = db.models.Post;
const PostImage = db.models.PostImage;

const getPostImages = async (req, res, next) => {
  try {
    const postsWithImages = await Post.findAll({
      attributes: ['id', 'image'],
    });

    if (!postsWithImages || postsWithImages.length === 0) {
      return res.status(404).json({ message: 'No datas found' });
    }

    for (const post of postsWithImages) {
      const postId = post.id;
      let imagePaths;

      try {
        // Check if 'image' is a valid JSON array
        imagePaths = JSON.parse(post.image);
      } catch (error) {
        console.error(`Error parsing JSON for post with ID ${postId}:`, error);
        continue; // Skip to the next iteration if there's an error parsing JSON
      }

      for (let index = 0; index < imagePaths.length; index++) {
        const imagePath = imagePaths[index];
        const formattedImage = {
          postId: postId,
          imagePath: imagePath,
        };

        try {
          // Create and store PostImage instance
          await PostImage.create(formattedImage);
        } catch (error) {
          console.error(`Error creating PostImage for post with ID ${postId}:`, error);
          continue; // Skip to the next iteration if there's an error creating PostImage
        }
      }
    }

    res.status(200).json({ message: 'Formatted images stored in PostImage database' });
  } catch (error) {
    console.error('Error in getPostImages:', error);
    next(error);
  }
};

module.exports = { getPostImages };
