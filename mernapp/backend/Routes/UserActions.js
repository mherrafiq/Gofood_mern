const express = require('express');
const router = express.Router();
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Multer for File Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Error: File upload only supports images (jpeg, jpg, png, webp)!"));
  }
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

    // Delete old image if it exists
    if (user.profileImage) {
      const oldImagePath = path.join(__dirname, '..', 'uploads', user.profileImage);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    user.profileImage = req.file.filename;
    await user.save();

    res.json({ 
      success: true, 
      message: "Image uploaded successfully!", 
      profileImage: req.file.filename 
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
      const imagePath = path.join(__dirname, '..', 'uploads', user.profileImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
      user.profileImage = "";
      await user.save();
    }

    res.json({ success: true, message: "Image deleted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Delete Error: " + error.message });
  }
});

module.exports = router;
