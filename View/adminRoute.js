const express = require("express")
const { getallUsers, adminLogin, getUserById } = require("../Controller/Admin-side/adminController")
const { addProduct } = require('../Controller/Admin-side/adminController');
const upload = require("../middleware/uploadMiddleware")
const router = express.Router()

router.get("/users",getallUsers)
router.post("/login",adminLogin)
router.get("/users/:id",getUserById)
router.post('/products', upload.single('image'), addProduct);

module.exports=router