const express = require('express')
const router  = express.Router()
const {userProtect} = require('../middleware/authMiddleware')
const {login,signup,stripeCheckOut,carBooking,getBookings} = require('../controllers/user')


router.post('/login',login)

router.post('/signup',signup)

router.post('/create-checkout-session',userProtect,stripeCheckOut)

router.post('/add-booking',userProtect,carBooking)

router.get('/get-bookings',userProtect,getBookings)
module.exports = router