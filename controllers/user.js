const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const Stripe = require('stripe')
const Booking = require('../models/bookingModel')
const stripe = Stripe(process.env.STRIPE_KEY)
const YOUR_DOMAIN = 'http://localhost:3000';


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


const stripeCheckOut = asyncHandler(async (req, res) => {
    const{carName,description,imageUrl,total} =  req.body.dataToServer
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data:{
            currency:'inr',
            product_data:{
                name:carName,
                images:[imageUrl],
                description:description
            },
            unit_amount:total*100,  
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}/success`,
      cancel_url: `${YOUR_DOMAIN}/cancel`,
    })
  
    res.send({url: session.url});
  });

  const carBooking = asyncHandler(async(req,res)=>{
    console.log(req.body);
    const response = await Booking.create(req.body)
  })
module.exports= {login,signup,stripeCheckOut,carBooking}