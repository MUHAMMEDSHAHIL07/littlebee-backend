const mongoose = require('mongoose')

const CartSchema = new mongoose.Schema({
    User:{
        type:String,
        ref:"users"
    },
    Product:{
        type:String,
        ref:"products"
    },
    quantity:{
        type:Number,
        default:1
    }
})
module.exports = mongoose.model("carts",CartSchema)