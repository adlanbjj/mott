const express = require("express");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();
const transporter = require("../config/nodemailer");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");
const Posts = require('../models/Posts');
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

router.post("/register", async (req, res) => {
  try {
    const { username, email, password, location, age } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      location,
      age,
    });

    await user.save();

    res.status(201).send({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send({ error: "Invalid username or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).send({ error: "Invalid username or password" });
    }

    const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const { password: _, ...userdata } = user.toObject();

    res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 3600000 });

    res.send({ userdata });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});


router.get("/user", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      console.log('No token found in cookies');
      return res.status(401).send({ error: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    res.send({ userdata: user });
  } catch (error) {
    console.log('Error verifying token or fetching user:', error);
    res.status(400).send({ error: error.message });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.send({ message: "Logged out successfully" });
});


router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ error: "No account with that email found." });
    }

    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;

    await user.save();

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL,
      subject: "Password Reset",
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
      Please click on the following link, or paste this into your browser to complete the process:\n\n
      http://${req.headers.host}/auth/reset/${token}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error sending email:", err);
        return res.status(500).send({ error: "Error sending email." });
      }
      res.status(200).send({ message: "Password reset link sent to email." });
    });
  } catch (error) {
    console.error("Error in /forgot-password:", error);
    res.status(500).send({ error: error.message });
  }
});

router.post("/reset/:token", async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).send({ error: "Password reset token is invalid or has expired." });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    res.status(200).send({ message: "Password has been reset." });
  } catch (error) {
    console.error("Error in /reset:", error);
    res.status(500).send({ error: error.message });
  }
});


router.get('/admin/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.send(users);
  } catch (error) {
    res.status(500).send({ error: 'Error fetching users' });
  }
});


router.delete('/admin/users/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    await user.deleteOne();
    res.send({ message: 'User and their posts deleted' });
  } catch (error) {
    console.error('Error deleting user and their posts:', error);
    res.status(500).send({ error: 'Error deleting user and their posts' });
  }
});

router.patch('/admin/users/block/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();
    res.send(user);
  } catch (error) {
    console.error('Error blocking/unblocking user:', error);
    res.status(500).send({ error: 'Error blocking/unblocking user' });
  }
});

router.get("/user-list", async (req, res) => {
  try {
    const users = await User.find().select("username age location _id"); 
    res.json(users);
  } catch (err) {
    res.status(500).send({ error: 'Error fetching users' });
  }
});

router.get("/user/:id", async (req, res) => {
  if (!req.params.id || req.params.id === 'undefined') {
    return res.status(400).send({ error: "No user ID provided" });
  }
  try {
    const user = await User.findById(req.params.id).select('username age location -_id');
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).send({ error: 'Internal server error' });
  }
});

router.get("/current", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.send(user);
  } catch (error) {
    res.status(500).send({ error: "Error fetching user data" });
  }
});

router.patch("/current", auth, upload.single('avatar'), async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["email", "password", "location", "age", "avatar"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const user = await User.findById(req.user._id);

    updates.forEach((update) => {
      if (update === "password" && req.body.password) {
        user.password = req.body.password;
      } else {
        user[update] = req.body[update];
      }
    });

    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }

    if (req.file) {
      user.avatar = `/uploads/${req.file.filename}`;
    }

    await user.save();
    const { password, ...updatedUser } = user.toObject();
    res.send(updatedUser);
  } catch (error) {
    res.status(400).send({ error: "Error updating user data" });
  }
});





module.exports = router;
