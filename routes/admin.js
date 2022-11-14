const express = require('express')
const router  = express.Router()
const {adminProtect} = require('../middleware/authMiddleware')
const { loginAdmin ,addCar}= require('../controllers/admin')


router.post('/login', loginAdmin)

router.post('/add-car',adminProtect,addCar)


module.exports = router