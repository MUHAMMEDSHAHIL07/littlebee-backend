const instance = require("../config/razorpay");

exports.createRazorpayOrder = async (req, res) => {
  const { amount } = req.body;

  try {
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_order_" + new Date().getTime(),
    };

    const order = await instance.orders.create(options);
    res.status(200).json(order);
  } catch (err) {
    console.error("Razorpay create order error:", err); // log this
    res.status(500).json({ error: "Failed to create order" });
  }
};
