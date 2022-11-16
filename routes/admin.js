const express = require('express')
const router  = express.Router()
const {adminProtect} = require('../middleware/authMiddleware')
const { loginAdmin ,addCar,getCar,deleteCar,getUsers,blockUser}= require('../controllers/admin')


router.post('/login', loginAdmin)

router.post('/add-car',adminProtect,addCar)

router.get('/get-cars',adminProtect,getCar)

router.delete('/delete-car',adminProtect,deleteCar)

router.get('/get-users',adminProtect,getUsers)

router.patch('/block-user',adminProtect,blockUser)

module.exports = router