const mongoose = require('mongoose')

const adminSchema = mongoose.Schema({
    userName:{
        type:String,
        require:[true,'Please add a user name']
    },
    password:{
        type:String,
        require:[true,'Please add a password']
    }
},
{
    timestamps:true
})

module.exports=mongoose.model('Admin',adminSchema)