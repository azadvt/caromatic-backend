const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const Admin = require("../models/adminModel");
const Car = require("../models/carModel");
const User = require("../models/userModel");
const Booking = require('../models/bookingModel')
const loginAdmin = asyncHandler(async (req, res) => {
  const { userName, password } = req.body;

  try {
    const admin = await Admin.findOne({ userName });
    if (admin && (await bcrypt.compare(password, admin.password))) {
      res.json({
        _id: admin._id,
        token: generateToken(admin._id),
        name: "admin",
      });
    } else {
      res.status(400);
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    res.status(500).json({ Err: error });
  }
});

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

//add cars

const addCar = asyncHandler(async (req, res) => {
  try {
    const {
        name,
        type,
        seat,
        transmission,
        fuel,
        description,
        price,
        imageName,
        imageUrl,
      } = req.body;
      const response = await Car.create({
        name,
        type,
        seat,
        transmission,
        fuel,
        description,
        price,
        imageName,
        imageUrl,
      });
    
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

const getCar = asyncHandler(async (req, res) => {
  try {
    console.log('worked get car');
    const cars = await Car.find();
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ Err: error });
  }
});

const deleteCar = asyncHandler(async (req, res) => {
  const { id } = req.query;

  try {
    if (!req.query.id) {
      res.status(404);
      throw new Error("Car not found");
    } else {
      const data = await Car.findById(id);
      if (data) {
        await data.remove();
        res.status(200).json({ message: "car deleted successfully" });
      } else {
        res.status(400).json({ messege: "car not removed" });
      }
    }
  } catch (error) {
    res.status(500).json({ Err: error });
  }
});

//get User

const getUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ Err: error });
  }
});

const blockUser = asyncHandler(async (req, res) => {
  try {
    if (!req.query.id) {
      res.status(404);
      throw new Error("User not found");
    }
    const user = await User.findById(req.query.id);
    if (user.isBlocked) {
      const unBlock = await User.findByIdAndUpdate(req.query.id, {
        isBlocked: false,
      });
      if (unBlock) {
        res.status(200).json({ message: `${user.name}'s Account Unblocked` });
      } else {
        res.status(400);
        throw new Error("Something went wrong");
      }
    } else {
      const block = await User.findByIdAndUpdate(req.query.id, {
        isBlocked: true,
      });
      if (block) {
        res.status(200).json({ message: `${user.name}'s Account Blocked` });
      } else {
        res.status(400);
        throw new Error("Something went wrong");
      }
    }
  } catch (error) {
    res.status(500).json({ Err: error });
  }
});


const getBookings= asyncHandler(async(req,res)=>{
  try {
    const bookings = await Booking.find()
    res.status(200).json(bookings)

  } catch (error) {
    res.status(500).json({ Err: error });

  }
})

module.exports = {
  loginAdmin,
  addCar,
  getCar,
  deleteCar,
  getUsers,
  blockUser,
  getBookings
};
