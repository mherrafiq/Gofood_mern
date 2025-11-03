const express = require('express');
const router = express.Router();
const Order = require('../models/Orders');

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

    // Check if user already has orders
    console.log("2️⃣  Checking for existing orders...");
    let existingOrder = await Order.findOne({ email: email.toLowerCase() });

    if (!existingOrder) {
      console.log("3️⃣  Creating new order document...");
      await Order.create({
        email: email.toLowerCase(),
        order_data: [data],
      });
      console.log("✅ New order created for:", email);
    } else {
      console.log("3️⃣  Updating existing order document...");
      await Order.findOneAndUpdate(
        { email: email.toLowerCase() },
        { $push: { order_data: data } }
      );
      console.log("✅ Order updated for:", email);
    }

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
    const myData = await Order.findOne({ email: req.body.email.toLowerCase() });
    
    if (!myData) {
      console.log("⚠️  No orders found for this user");
      return res.json({ 
        success: true,
        orderData: null,
        message: "No orders found"
      });
    }

    console.log("✅ Orders found:", myData.order_data.length, "orders");
    console.log("═══════════════════════════════════════\n");

    return res.json({ 
      success: true,
      orderData: myData
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