const express = require("express");
const Message = require("../models/Message");
const User = require("../models/User");
const router = express.Router();

router.post("/send", async (req, res) => {
  try {
    const { content, recipient } = req.body;
    const sender = req.user._id;
    const message = new Message({ content, sender, recipient });
    await message.save();
    res.status(201).send(message);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.get("/conversation/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await Message.find({
      $or: [{ sender: req.user._id, recipient: userId }, { sender: userId, recipient: req.user._id }]
    }).sort({ createdAt: 1 });
    res.send(messages);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

module.exports = router;
