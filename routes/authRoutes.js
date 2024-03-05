const express = require('express')
const authController = require('../controllers/authController')
const { verifyToken } = require('../utils/verifyUser')
const router = express.Router()


router.post('/signup',authController.signup)

router.post('/signin',authController.signin)

router.get('/getvalue',verifyToken,(req,res)=>{
    res.json({message:'Access granted'})
})

router.get('/signout',verifyToken,authController.signout)

module.exports = router;


