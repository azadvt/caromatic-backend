const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const Admin = require('../models/adminModel')
const Car = require('../models/carModel')

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


module.exports = {
    loginAdmin,addCar
}