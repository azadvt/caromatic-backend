const mongoose = require('mongoose')

const carSchema = mongoose.Schema(
    {
    name:{
        type:String,
        require:[true,'Please enter Name']
    },
    type:{
        type:String,
        require:[true,"Please enter type"]
    },
    seat:{
        type:Number,
        require:[true,"Please enter Seating Capacity"]
    },transmission:{    
        type:String,
        require:[true,"Please enter Transimission"]
    },fuel:{
        type:Number,
        require:[true,"Please enter Fuel Capacity"]
    },imageName:{
        type:String,
        require:[true,"Please insert imageName"]
    },imageUrl:{
        type:[String],
        require:[true,"Please insert imageUrl"]
    },
    description:{
        type:String,
        require:[true,"Please enter Description"]
    },
    price:{
        type:Number,
        require:[true,"Please enter Number"]
    },

    }
)

module.exports = mongoose.model('Car',carSchema)