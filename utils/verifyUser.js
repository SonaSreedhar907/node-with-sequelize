const jwt = require('jsonwebtoken')
const errorHandler = require('../utils/errorHandler')


const verifyToken = (req,res,next)=>{
    const token = req.cookies.access_token
    if(!token){
        return res.status(401).json({error:'Unauthorized'})
    }
    jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
        if(err){
            return res.status(401).json({error:'Unauthorized'})
        }
        req.user = user
        next()
    })
}

module.exports = {verifyToken}



