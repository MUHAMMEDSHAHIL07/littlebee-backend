const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    count: {
        type: Number,
        default: 1
    },
    category: {
        type: String,
        required: true
    },
    images: [{
        type:String
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: String
    },
    updateAt: {
        type: String
    }
})

module.exports = mongoose.model("products",productSchema)