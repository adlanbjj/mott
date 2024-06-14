const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();
const router = express.Router();

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

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
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

module.exports = router;
