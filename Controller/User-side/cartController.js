const cartModel = require("../../Model/cartModel")
const ordermodel = require("../../Model/orderModel")
const productmodel = require("../../Model/productModel")
exports.addTocart = async(req,res)=>{
  const { userId, Productid } = req.body;
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

exports.getCart = async (req, res) => {
  const userId = req.user.id;
  try {
    const cartItem = await cartModel.find({ User: userId }).populate("Product");
    if (cartItem.length === 0) {
      return res.status(404).json({ message: "no product in cart" });
    }
    res.status(200).json({ cart: cartItem,count: cartItem.length  });
  } catch (error) {
    res.status(500).json({ message: "failed to get cart" });
  }
};
exports.getCartCount = async (req, res) => {
  const userId = req.user.id;
  try {
    const count = await cartModel.countDocuments({ User: userId });
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: "Failed to get cart count" });
  }
};

exports.buyFromCart = async(req,res)=>{
  try{
    const {paymentMethod} = req.body
    const userId = req.user.id
    const cartItems = await cartModel.find({User:userId}).populate("Product")
    if(cartItems.length===0){
        return res.status(404).json({message:"cart is empty"})
    }
    const items = []
    let total = 0
    for(const i of cartItems){
        const products = i.Product    
        if(products<i.quantity){
            return res.status(404).json({message:"item out of stock"})
        }
        items.push({
            productId:products._id,
            quantity:i.quantity,
            price:products.price
        })
        total+=products.price*i.quantity
        await productmodel.findByIdAndUpdate(products._id,{
            $inc:{
                stock:-i.quantity
            }
        })    
    }
    const newOrder ={
        items,
        total,
        paymentMethod
    }
    const userOrder = await ordermodel.findOne({userId})
    if(userOrder){
        userOrder.orders.push(newOrder)
        await userOrder.save()
    }
    else{
        await ordermodel.create({
            userId,
            orders:[newOrder]
        })
    }
    await cartModel.deleteMany({User:userId})
    res.status(200).json({message:"order is placed succesfully"})
  }
  catch(error){
    return res.status(500).json({message:"server error"+error.message})
  }
}
exports.removeItem = async(req,res)=>{
    try{
        const userId = req.user.id
        const productId = req.params.id
        const deleteItem = await cartModel.findOneAndDelete({
            User:userId,
            Product:productId
        })
         if (!deleteItem) {
        return res.status(404).json({ message: "Item not found in cart" });
    }
        res.status(200).json({ message: "Item removed from cart" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
  }
}
exports.updateQuantity = async (req, res) => {
  const userId = req.user.id;
  const productId = req.params.id;
  const { quantity } = req.body;

  if (quantity < 1) return res.status(400).json({ message: "Invalid quantity" });

  try {
    const cartItem = await cartModel.findOne({ User: userId, Product: productId });
    if (!cartItem) return res.status(404).json({ message: "Item not found in cart" });

    cartItem.quantity = quantity;
    await cartItem.save();
    res.status(200).json({ message: "Quantity updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
