const express = require('express')
const dotenv = require('dotenv')

const port = process.env.PORT || 5000

const app = express()

app.use('/api/admin',require('./routes/admin'))
app.use('/api/user',require('./routes/user'))

app.listen(port,()=>{
    console.log(`server started in ${port}`);
})