const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const errorHandler = require('../utils/errorHandler');
const { db } = require('../models');
const { body, validationResult } = require('express-validator');

const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')


const User = db.models.User;

const signupValidationRules = [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

const signup = async (req, res, next) => {
    // Validate the request body against the defined rules
    await Promise.all(signupValidationRules.map(validationRule => validationRule.run(req)));

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
        // Check if the username or email already exists in the database
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [
                    { username: username },
                    { email: email },
                ],
            },
        });

        if (existingUser) {
            const conflictingField = existingUser.username === username ? 'username' : 'email';
            return res.status(400).json({ message: `User with this ${conflictingField} already exists` });
        }

        // Hash the password using bcrypt
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Create a new user using Sequelize model
        await User.create({
            username,
            email,
            password: hashedPassword,
        });

        return res.json({ message: 'Signup successful' });
    } catch (error) {
        return next(error);
    }
};



const signin = async(req,res,next)=>{
    const {email,password} = req.body
    if(!email || !password || email==='' || password===''){
        return res.status(400).json({error : 'All fields are required'})    }
    try{
        const validUser = await User.findOne({where:{email}})
        if(!validUser){
            return res.status(404).json({error : 'User not found'})
        }
        const validPassword = bcryptjs.compareSync(password,validUser.password)
        if(!validPassword){
            return res.status(400).json({error : 'Invalid Password'})
        }
        const token = jwt.sign(
            {id:validUser.id,isAdmin:validUser.isAdmin},
            process.env.JWT_SECRET
        )
        const {password:pass,...rest} = validUser.get()

        res.status(200)
         .cookie('access_token',token,{httpOnly:true})
         .json({message : 'Signin Successfull',token})
    }catch(error){
        next(error)
    }
}

const signout = async(req,res,next)=>{
    try{
        const userId = req.user.id
        const user = await User.findByPk(userId)
        if(user){
            user.accessToken = null
            await user.save()
        }
        res.clearCookie('access_token')
        res.status(200).json('User has been signed out')
    }catch(error){
        next(error)
    }
}

module.exports = { signup,signin,signout };
