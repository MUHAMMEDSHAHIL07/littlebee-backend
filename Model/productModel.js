const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    name:String,
    description:String,
    price:Number,
    count:Number,
    category:String,
    images:[{
        type:String
    }],
    isActive:{
        type:Boolean,
        default:true
    },
    createdAt:String,
    updatedAt:String
})

module.exports = mongoose.model("products",productSchema)