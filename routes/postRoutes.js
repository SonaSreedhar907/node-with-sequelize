const express = require('express')
const postController = require('../controllers/postController')

const { verifyToken } = require('../utils/verifyUser')
const router = express.Router()


router.post('/create',postController.upload,verifyToken,postController.create)

router.get('/getposts',postController.getposts)

router.delete('/:postid',verifyToken,postController.deletePost)

router.put('/:postId/update',verifyToken,postController.updatePost)

router.get('/search',verifyToken,postController.getsposts)

module.exports=router