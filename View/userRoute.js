const express = require("express")
const router = express.Router()

const {userRegister, userLogin, resetPassword, getUserByid, logOut} = require("../Controller/User-side/userController")
const {allProduct, productId, productCategory} = require("../Controller/User-side/productController")
const { jwtMiddleware, getUserFromToken } = require("../middleware/authMiddleware")
const { addTocart, getCart, removeItem, buyFromCart, getCartCount, updateQuantity } = require("../Controller/User-side/cartController")
const { Order, getOrder } = require("../Controller/User-side/orderContoller")
const checkBlock = require("../middleware/checkBlocked")

router.post("/register",userRegister)
router.post("/login",checkBlock,userLogin)
router.patch("/resetpassword",resetPassword)
router.get("/me", getUserFromToken);
router.get("/users/:id",getUserByid)
router.get("/product",allProduct)
router.get("/product/:id",productId)
router.get("/category/:categoryName",productCategory)
router.post("/addtocart",jwtMiddleware,addTocart)
router.get("/getCart",jwtMiddleware,getCart)
router.get("/cartcount", jwtMiddleware, getCartCount);
router.post("/order",jwtMiddleware,Order)
router.post("/buyfromcart",jwtMiddleware,buyFromCart)
    router.get("/getOrder",jwtMiddleware,getOrder)
router.delete("/removeItem/:id",jwtMiddleware,removeItem);
router.patch('/updateQuantity/:id', jwtMiddleware,updateQuantity);

router.post("/logout",logOut)

module.exports=router