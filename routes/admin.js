const express = require('express')
const router  = express.Router()
const {adminProtect} = require('../middleware/authMiddleware')
const { loginAdmin ,addCar,getCar,deleteCar,getUsers,blockUser,getBookings}= require('../controllers/admin')


router.post('/login', loginAdmin)

router.post('/add-car',adminProtect,addCar)

router.get('/get-cars',getCar)

router.delete('/delete-car',adminProtect,deleteCar)

router.get('/get-users',adminProtect,getUsers)

router.get('/block-user',adminProtect,blockUser)

router.get('/get-bookings',adminProtect,getBookings)


module.exports = router