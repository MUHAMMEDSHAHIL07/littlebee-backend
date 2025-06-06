const express = require("express");
const router = express.Router();
const { createRazorpayOrder } = require("../Controller/paymentController");

router.post("/create-order", createRazorpayOrder);

module.exports = router;