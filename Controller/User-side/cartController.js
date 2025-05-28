const cartModel = require("../../Model/cartModel")
exports.addTocart = async(req,res)=>{
    const Productid = req.body.id
    const userId = req.user.id

    try{
        if(!Productid) return res.status(400).json({message:"product id not found"})
        const existingproduct = await cartModel.findOne({User:userId,Product:Productid})
        if(existingproduct){
            existingproduct.quantity+=1
            await existingproduct.save()
            return res.status(200).json({message:"quantity have been changed"})
        }
        await cartModel.create({User:userId,Product:Productid,quantity:1})
       res.status(200).json({message:"product is added is succesfully"})
    }
    catch(error){
        res.status(500).json({message:"can't add to cart"})
    }
}

exports.getCart = async(req,res)=>{
    const userId = req.user.id   
    try{
        const cartItem = await cartModel.find({User:userId}).populate("Product")
        if(!cartItem){
            return res.status(404).json({message:"no product in cart"})
        }
        res.status(200).json({cart:cartItem})
    }
    catch(error){
        res.status(500).json({message:"failed to get cart"})
    }
}