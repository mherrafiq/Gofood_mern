const express = require('express');
const router = express.Router();
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer for Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'gofood_profiles',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  },
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// ============ FETCH USER DATA ============
router.post('/getuser', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    const user = await User.findOne({ email: email.toLowerCase() }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error: " + error.message });
  }
});

// ============ UPLOAD PROFILE IMAGE ============
router.post('/uploadimage', upload.single('profileImage'), async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });
    if (!req.file) return res.status(400).json({ success: false, message: "No image uploaded" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Note: Old Cloudinary image deletion can be added here if needed using cloudinary.uploader.destroy

    user.profileImage = req.file.path; // Cloudinary returns the full URL in req.file.path
    await user.save();

    res.json({ 
      success: true, 
      message: "Image uploaded successfully!", 
      profileImage: req.file.path 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Upload Error: " + error.message });
  }
});

// ============ DELETE PROFILE IMAGE ============
router.delete('/deleteimage', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (user.profileImage) {
      // If it's a Cloudinary URL, we could extract the public_id and delete it
      // For now, we'll just clear it from the database for simplicity
      user.profileImage = "";
      await user.save();
    }

    res.json({ success: true, message: "Image deleted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Delete Error: " + error.message });
  }
});

module.exports = router;

