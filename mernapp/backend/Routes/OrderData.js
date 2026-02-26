const express = require('express');
const router = express.Router();
const User = require('../models/User');

// ============ CREATE/UPDATE ORDER ============
router.post('/orderData', async (req, res) => {
  console.log("\n═══════════════════════════════════════");
  console.log("📌 ORDER DATA REQUEST");
  console.log("═══════════════════════════════════════");
  console.log("Body received:", req.body);

  try {
    const { email, order_data, order_date } = req.body;

    // Validate request
    if (!email || !order_data || !order_date) {
      console.log("❌ Missing required fields");
      return res.status(400).json({
        success: false,
        message: "Missing required fields: email, order_data, or order_date",
      });
    }

    console.log("1️⃣  Processing order for:", email);
    console.log("   Items count:", order_data.length);

    // Add order date at the start
    const data = [{ Order_date: order_date }, ...order_data];

    // Check if user exists and update order_data
    console.log("2️⃣  Updating user order history...");
    let user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { $push: { order_data: data } },
      { new: true }
    );

    if (!user) {
      console.log("❌ User not found");
      return res.status(404).json({
        success: false,
        message: "User not found. Please register first.",
      });
    }

    console.log("✅ Order saved to user document for:", email);
    console.log("═══════════════════════════════════════\n");

    return res.json({
      success: true,
      message: "Order placed successfully!"
    });

  } catch (error) {
    console.error("❌ Error in /orderData:", error.message);
    console.error("═══════════════════════════════════════\n");

    return res.status(500).json({
      success: false,
      message: "Server Error: " + error.message,
    });
  }
});

// ============ GET USER ORDERS ============
router.post('/myorderData', async (req, res) => {
  console.log("\n═══════════════════════════════════════");
  console.log("📌 MY ORDER DATA REQUEST");
  console.log("═══════════════════════════════════════");
  console.log("Email:", req.body.email);

  try {
    if (!req.body.email) {
      console.log("❌ Email not provided");
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    console.log("1️⃣  Fetching orders for:", req.body.email);
    const userData = await User.findOne({ email: req.body.email.toLowerCase() });

    if (!userData) {
      console.log("❌ User not found");
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    console.log("✅ Orders found:", userData.order_data ? userData.order_data.length : 0, "orders");
    console.log("═══════════════════════════════════════\n");

    return res.json({
      success: true,
      orderData: userData // This contains order_data array
    });

  } catch (error) {
    console.error("❌ Error in /myorderData:", error.message);
    console.error("═══════════════════════════════════════\n");

    return res.status(500).json({
      success: false,
      message: "Server Error: " + error.message
    });
  }
});

module.exports = router;
