const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const Stripe = require("stripe");
const Booking = require("../models/bookingModel");
const stripe = Stripe(process.env.STRIPE_KEY);
const YOUR_DOMAIN = "http://localhost:3000";
const { ObjectId } = require('bson')
const Car = require('../models/carModel')
//Generate JWT

const generateToken = (id) => {
  try {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
  } catch (error) {
    res.status(500).json({ Err: error });
  }
};

const login = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    console.log("user",user);
    if (user.isBlocked===false && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        name: user.name,
        token: generateToken(user._id),
      });
    }

    if(user.isBlocked){
      console.log("blocked user");
      res.status(403).json({message:"user is blocked"})
     
    } 
    else {
      res.status(400);
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    res.status(500).json({ Err: error });
  }
});

const signup = asyncHandler(async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password || !phone) {
      res.status(400);
      throw Error("Please add all fields");
    }

    //Check if user exits

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Create user
    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
    res.json({ message: "Register User" });
  } catch (error) {
    res.status(500).json({ Error: error });
  }
});

const stripeCheckOut = asyncHandler(async (req, res) => {
    try {
    const { carName, description, imageUrl, total } = req.body;
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: carName,
              images: [imageUrl],
              description: description,
            },
            unit_amount: total * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${YOUR_DOMAIN}/success`,
      cancel_url: `${YOUR_DOMAIN}/cancel`,
    });

    res.send({ url: session.url });
  } catch (error) {
    res.status(500).json({ Err: error });
  }
});

const carBooking = asyncHandler(async (req, res) => {
  try {
    const response = await Booking.create(req.body);
    if (response) {
      res.status(200).json({ message: "data added successfully" });
    } else {
      res.status(400);
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    res.status(500).json({ Err: error });
  }
});

const getBookings = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.query;
   
    const bookings = await Booking.aggregate([
      {
        '$match': {
          'userId':  ObjectId(userId)
        }
      }, {
        '$lookup': {
          'from': 'cars', 
          'localField': 'carId', 
          'foreignField': '_id', 
          'as': 'car'
        }
      }, {
        '$unwind': {
          'path': '$car'
        }
      }
    ])
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ Err: error });
  }
});

const filterCars = asyncHandler(async (req,res)=>{
  try {

    const { value } = req.query;

    const response =  await Car.find({type:value})
    res.status(200).json(response)
  } catch (error) {
    
  }
})

module.exports = { login, signup, stripeCheckOut, carBooking, getBookings,filterCars};
