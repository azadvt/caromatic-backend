const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const bcrypt = require('bcrypt')



//Generate JWT

const generateToken = (id) =>{
    return  jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:'30d', 
    })
}


const login = asyncHandler(async(req,res)=>{
    const {email,password} = req.body
    
    const user = await User.findOne({email})
    if(user && (await bcrypt.compare(password,user.password))) {
        res.json({
            _id:user.id,
            name:user.name,
            token:generateToken(user._id)

        })
    } else{
        res.status(400)
        throw new Error('Invalid Credentials')
    }
})


const signup = asyncHandler(async(req,res)=>{
        const {name,email,password,phone} = req.body  
        if(!name || !email || !password|| !phone){
            res.status(400)
            throw Error('Please add all fields')
        }
        
       
        //Check if user exits

        const userExists = await User.findOne({email})
            console.log(userExists);
        if(userExists) {
            res.status(400)
            throw new Error('User already exists')
        }
    
        //hash password
        const salt  = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)
    
        //Create user 
        const user = await User.create({
            name,
            email, 
            password:hashedPassword
        })
    
        if(user){
            res.status(201).json({
                _id:user.id,
                name:user.name,
                email:user.email,
                token:generateToken(user._id)
            })
        } else{
            res.status(400)
            throw new Error('Invalid user data')
        }
        res.json({message:'Register User'})
    
})
module.exports= {login,signup}