const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please add a name']
    },
    email:{
        type:String,
        required:[true,'Please add a email'],
        unique:true
    },
    password:{
        type:String,
        required:[true,'Please add a password']
    },
    phone:{
        type:Number,
        require:[true,'Please add a phone number']
    },
    isBlocked:{
        type:Boolean,
        require:true,
        default:false
    }
        
},
{
    timestaps:true 
})

module.exports = mongoose.model('User',userSchema)