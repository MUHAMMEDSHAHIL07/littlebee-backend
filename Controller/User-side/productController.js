const productModel = require("../../Model/productModel");

exports.allProduct = async(req,res)=>{
    try{
        const product = await productModel.find()
        res.json(product)
    }
    catch(error){
        res.status(400).json({message:"failed to get product"})
    }
}

exports.productId = async(req,res)=>{
    try{
        const product = await productModel.findById(req.params.id)
        if(!product) return res.status(400).json({message:"product not found"})
        res.json(product)
    }
    catch(error){
        res.status(500).json({message:"Failed to get product"})
    }
}

exports.productCategory = async(req,res)=>{
    try{
    const categoryname = req.params.categoryName
    const getproduct = await productModel.find({category:categoryname})
    if(getproduct==null) return res.status(404).json({message:"product not found"})
        res.json(getproduct)
    }
    catch(error){
        res.status(500).json({message:"error to get product category"})
    }
}
