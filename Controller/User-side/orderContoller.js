const orderModel = require("../../Model/orderModel")
const productmodel = require("../../Model/productModel")
const cartModel = require("../../Model/cartModel")

exports.Order = async (req, res) => {

    try {
        const { orderBy, items, paymentMethod } = req.body
        let total = 0
        console.log(req.body);
        console.log(items);

        for (const item of items) {
            const product = await productmodel.findById(item.productId)
            if (!product) {
                return res.status(404).json({ message: "Product not found" })
            }
            if (product.stock < item.quantity) {
                return (400).json({ message: "out of stock" })
            }
            total += product.price * item.quantity
            console.log(product);
        }

        for (const item of items) {
            await productmodel.findByIdAndUpdate(
                item.productId,
                { $inc: { stock: -item.quantity } }
            );

        }

        const order = new orderModel({
            orderBy,
            items,
            total,
            paymentMethod
        })

        await order.save()
        await cartModel.deleteMany({ User: orderBy })
        res.status(201).json({ message: "order is placed" })
    }
    catch (error) {
        res.status(500).json("server error" + error)
    }
}
exports.getOrder = async(req,res)=>{
    const userId = req.user.id
    try{
        const orderItem = await orderModel.find({orderBy:userId}).populate("orderBy")
        if(!orderItem){
            return res.status(404).json({message:"no orders"})
        }
        res.status(200).json({order:orderItem})
    }
    catch(error){
        res.status(500).json({message:"failed to get"})
    }
}