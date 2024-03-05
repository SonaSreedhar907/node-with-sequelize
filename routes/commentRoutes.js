const express = require('express')
const commentController = require('../controllers/commentController')
const { verifyToken } = require('../utils/verifyUser')
const router = express.Router()


router.post('/create',verifyToken,commentController.createComment)

router.get('/getPostComments/:postid',commentController.getPostComments)

router.delete('/deleteComment/:commentid',verifyToken,commentController.deleteComment)

router.put('/editComment/:commentid',verifyToken,commentController.editComment)

module.exports=router       