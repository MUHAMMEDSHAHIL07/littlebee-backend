const orderModel = require("../../Model/orderModel")
const productmodel = require("../../Model/productModel")
const cartModel = require("../../Model/cartModel")

exports.Order = async (req, res) => {

    try {
        const { items,paymentMethod } = req.body
        const userId = req.user.id
        let total = 0
        console.log(req.body);
        console.log(items);

        for (const item of items) {
            const product = await productmodel.findById(item.productId)
            if (!product) {
                return res.status(404).json({message:"Product not found"})
            }
            if (product.stock < item.quantity) {
                return (400).json({ message: "out of stock" })
            }
            total += product.price * item.quantity
            console.log(product);
        }
        const newOrder = {
            items,
            paymentMethod,
            total
        }

        let userOrder = await orderModel.findOne({userId:userId})
        if(userOrder){
            userOrder.orders.push(newOrder)
            await userOrder.save()
        }
        else{
         const order = new orderModel({
           userId:userId,
           orders:[newOrder]
        })

        await order.save()
        }
            for (const item of items) {
            await productmodel.findByIdAndUpdate(
                item.productId,
                { $inc: { stock: -item.quantity } }
            );

        }
        await cartModel.deleteMany({ User: userId })
        res.status(201).json({ message: "order is placed" })
    }
    catch (error) {
        res.status(500).json("server error" + error)
    }
}
exports.getOrder = async(req,res)=>{
    const userId = req.user.id
    try{
        const orderItem = await orderModel.find({userId:userId}).populate("orders")
        if(!orderItem){
            return res.status(404).json({message:"no orders found"})
        }
        res.status(200).json({order:orderItem})
    }
    catch(error){
        res.status(500).json({message:"failed to get"})
    }
}