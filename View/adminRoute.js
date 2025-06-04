const express = require("express")
const { getallUsers, adminLogin, getUserById, getAllProduct, getCategory, getProductById, deleteProduct, EditProduct, blockAndUnBlock, getAllOrder } = require("../Controller/Admin-side/adminController")
const { addProduct } = require('../Controller/Admin-side/adminController');
const upload = require("../middleware/uploadMiddleware");
const { isAdmin, jwtMiddleware } = require("../middleware/authMiddleware");
const router = express.Router()

router.get("/users",jwtMiddleware,isAdmin,getallUsers)
router.post("/login",adminLogin)
router.get("/users/:id",jwtMiddleware,isAdmin,getUserById)
router.post('/products', upload.single('image'),jwtMiddleware,isAdmin, addProduct);
router.get("/allproduct",jwtMiddleware,isAdmin,getAllProduct)
router.get("/category/:categoryName",jwtMiddleware,isAdmin,getCategory)
router.get("/product/:id",jwtMiddleware,isAdmin,getProductById)
router.delete("/delete/:id",jwtMiddleware,isAdmin,deleteProduct)
router.patch("/editproduct/:id",upload.single("image"),jwtMiddleware,isAdmin,EditProduct)
router.patch("/user/block/:id",jwtMiddleware,isAdmin,blockAndUnBlock)
router.get("/getAllOrder",jwtMiddleware,isAdmin,getAllOrder)
module.exports=router