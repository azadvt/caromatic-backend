const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const bookingSchema = new Schema({
    carId : ObjectId,
    userId : ObjectId,
    name:{
        type:String,
        require:[true,'please enter name']
    },
    phone:{
        type:Number,
        require:[true,'please enter phone']
    },address:{
        type:String,
        require:[true,'please enter address']
    },town:{
        type:String,
        require:[true,'please enter town']
    },pickUpLocation:{
        type:String,
        require:[true,'please enter pickup location']
    },
    pickUpTime:{
        type:String,
        require:[true,'please enter pickup time']
    }
    ,dropOffLocation:{
        type:String,
        require:[true,'please enter dropoff location']
    },
    dropOffTime:{
        type:String,
        require:[true,'please enter dropoff time']
    },
    payment:{
        type:String,
        require:[true,'please choose payment methode']
    },
    total:{
        type:Number,
        require:[true,'please enter total amount']
    }

},
{
    timestamps:true
})

module.exports=mongoose.model('Booking',bookingSchema)