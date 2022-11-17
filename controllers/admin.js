const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const Admin = require('../models/adminModel')
const Car = require('../models/carModel')
const User = require('../models/userModel')

const loginAdmin = asyncHandler(async(req,res)=>{
    const {userName,password} = req.body
  
    const admin = await Admin.findOne({userName})
    if(admin && (await bcrypt.compare(password,admin.password))) {
        res.json({
            _id:admin._id,
            token:generateToken(admin._id),
            name:"admin"
        })
    }
    else{
        res.status(400)
        throw new Error('Invalid Credentials')
    }
})

//Generate JWT

const generateToken = (id) =>{
    return  jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:'30d', 
    })
}


//add cars

const addCar = asyncHandler(async(req,res)=>{
    const { name,
        type,
        seat,
        transmission,
        fuel,
        description,
        price,
        imageName,
        imageUrl} = req.body
        const response = await Car.create({name,
            type,
            seat,
            transmission,
            fuel,
            description,
            price,
            imageName,
            imageUrl})

            if(response){
                res.status(200).json(
                    {message:'data added successfully'}
                )
            }
            else{
                res.status(400)
                throw new Error('Invalid credentials')
            }

})

const getCar =asyncHandler( async(req,res)=>{
    const cars = await Car.find()
    res.json(cars)
    })


const deleteCar = asyncHandler(async(req,res)=>{
    const {id} = req.query

    if (!req.query.id) {
        res.status(404)
        throw new Error('Car not found')
    } else{
      const data = await  Car.findById(id)
      if(data){
        await data.remove()
        res.status(200).json({message:"car deleted successfully"})

      }
      else{
        res.status(400).json({messege:"car not removed"})
      }
    }
})


//get User

const getUsers = asyncHandler(async(req,res)=>{
    const users = await User.find()
    res.status(200).json(users)

    
})

const blockUser = asyncHandler(async(req,res)=>{
    if (!req.query.id) {
        res.status(404)
        throw new Error('User not found')
    }   
    const user = await User.findById(req.query.id)
if (user.isBlocked) {
    const unBlock = await User.findByIdAndUpdate(req.query.id, {
        isBlocked: false
    })
    if (unBlock) {
        res.status(200).json({ message: `${user.name}'s Account Unblocked` })
    } else {
        res.status(400)
        throw new Error('Something went wrong')
    }
} else {
    const block = await User.findByIdAndUpdate(req.query.id, {
        isBlocked: true
    })
    if (block) {
        res.status(200).json({ message: `${user.name}'s Account Blocked` })
    } else {
        res.status(400)
        throw new Error('Something went wrong')
    }
}
})


module.exports = {
    loginAdmin,addCar,getCar,deleteCar,getUsers,blockUser
}