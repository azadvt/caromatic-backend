const express = require('express')
const dotenv = require('dotenv').config()
const connectDB = require('./config/db')
const port = process.env.PORT || 5000
connectDB()
const app = express()

app.use(express.json())


app.use(express.urlencoded({extended:false}))

var cors = require('cors')

app.use(cors())

app.use('/api/admin',require('./routes/admin'))
app.use('/api/user',require('./routes/user'))

app.listen(port,()=>{
    console.log(`server started in ${port}`);
})