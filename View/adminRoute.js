const express = require("express")
const { getallUsers, adminLogin, getUserById, getAllProduct, getCategory, getProductById, deleteProduct, EditProduct, blockAndUnBlock, getAllOrder } = require("../Controller/Admin-side/adminController")
const { addProduct } = require('../Controller/Admin-side/adminController');
const upload = require("../middleware/uploadMiddleware")
const router = express.Router()

router.get("/users",getallUsers)
router.post("/login",adminLogin)
router.get("/users/:id",getUserById)
router.post('/products', upload.single('image'), addProduct);
router.get("/allproduct",getAllProduct)
router.get("/category/:categoryName",getCategory)
router.get("/product/:id",getProductById)
router.delete("/delete/:id",deleteProduct)
router.patch("/editproduct/:id",upload.single("image"),EditProduct)
router.patch("/user/block/:id",blockAndUnBlock)
router.get("getAllOrder",getAllOrder)
module.exports=router