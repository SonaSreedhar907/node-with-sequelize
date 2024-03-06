const express = require('express')
const postImageController = require('../controllers/postImageController')
const { verifyToken } = require('../utils/verifyUser')
const router = express.Router()

router.get('/post-images',postImageController.getPostImages)

module.exports=router