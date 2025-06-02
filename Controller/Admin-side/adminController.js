const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const userModel = require("../../Model/userModel")
const Product = require("../../Model/productModel")
const ordermodel = require("../../Model/orderModel")

exports.getallUsers = async(req,res)=>{
    try{
        const usersData = await userModel.find()
        res.status(200).json({data:usersData})
    }
    catch(error){
        res.status(500).json({message:"cant get users",error})
    }
}
exports.adminLogin  = async(req,res)=>{
    try{
        const email=req.body.email
        const password = req.body.password
        const adminCheck = await userModel.findOne({email:email,role:"admin"})

        if(!adminCheck) return res.status(400).json({message:"invalid details"})
            const match = await bcrypt.compare(password,adminCheck.password)
            if(!match) return res.status(400).json({message:"password doesnot match"})

                const token = jwt.sign({id:adminCheck._id},process.env.JWT_SECRET,{expiresIn: '24h'})
                res.cookie("token",token,{
                        httpOnly: true,
                        secure: false,
                        sameSite: 'strict',
                        maxAge: 60 * 60 * 1000
                })
                res.status(200).json({message:"login succesfull"})
    }
    catch(error){
        res.status(500).json({message:"internal server error"})
    }
}
exports.getUserById = async(req,res)=>{
    try{
        const userId = req.params.id
        const getuser = await userModel.findById(userId)
        if(!getuser) return res.status(404).json({message:"user not found"})
            res.status(200).json({userData:getuser})
    }
    catch(error){
        res.status(500).json({message:"internal server error",error})
    }
}

exports.addProduct = async(req,res)=>{
    try{
        const {name,description,price,category,gender,stock} = req.body
        const image = req.file ? req.file.path : null;
        if(!name||!description||!price){
            return res.status(400).json({message:"fill all the field"})
        }
        const newProduct = new Product({
        name,
        description,
        price,
        category,
        gender,
        stock,
        image:image
    })
    await newProduct.save()
    res.status(201).json({
        message:"product added succesfully"
    })
    }
    catch(error){
        res.status(500).json({message:"server error"})
    }
 
}
exports.getAllProduct = async(req,res)=>{
    try{
        const product = await Product.find()
        res.status(200).json({products:product})
    }
    catch(error){
        res.status(500).json({message:"server error"})
    }
}

exports.getCategory = async(req,res)=>{
    try{
        const categoryname = req.params.categoryName
        const getproduct = await Product.find({category:categoryname})
        if(getproduct==null) return res.status(404).json({message:"product not found"})
            res.json(getproduct)
        }
        catch(error){
            res.status(500).json({message:"error to get product category"})
        }
}
exports.getProductById = async(req,res)=>{
    try{
        const product = await Product.findById(req.params.id)
        if(!product) return res.status(404).json({message:"product not found"})
        res.status(200).json({product:product})
    }
    catch(error){
        res.status(500).json({message:"server error"})
    }
}
exports.deleteProduct = async(req,res)=>{
    try{
        const productid = req.params.id
        const itemDelete = await Product.deleteOne({ _id: productid })
        if(!itemDelete) return res.status(404).json({message:"item not found"})
            res.status(200).json({message:"product is deleted"})
    }
    catch(error){
        res.status(500).json(error)
    }
}
exports.EditProduct = async(req,res)=>{
    try{
        const productid = req.params.id
        const product = await Product.findById(productid)
        if (!product) return res.status(404).json({message:"product not found"})
            const image = req.file ? req.file.path :product.image

        product.name = req.body.name || product.name 
        product.price = req.body.price || product.price
        product.category = req.body.category || product.category
        product.gender = req.body.gender || product.gender
        product.stock = req.body.stock || product.stock
        product.image = image 

        await product.save()
        res.status(200).json({message:"product is updated",updated:product})
    }
    catch(error){
        res.status(500).json({message:"server error",error})
    }
}
exports.blockAndUnBlock = async(req,res)=>{
    try{
        const userId = req.params.id
        const isActive = req.body

        const user = await userModel.updateOne({_id:userId},{$set:isActive})
        if(!user) return res.status(404).json({message:"user not found"})
        res.status(200).json({message:!req.body.isActive?"user is blocked succesfully":"user is unblocked succesfully"})
    }
    catch(error){
        res.status(500).json({message:"server error",error})
    }
}
exports.getAllOrder = async(req,res)=>{
    try{
        const order = await ordermodel.find()
        if(order.length===0){
           return res.status(404).json({message:"no orders yet"})
        }
        res.status(200).json({Orders:order})
    }
    catch(error){
        return res.status(500).json({message:"server error",error})
    }
}