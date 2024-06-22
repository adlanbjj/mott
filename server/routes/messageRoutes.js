const express = require("express");
const Message = require("../models/Message");
const User = require("../models/User");
const router = express.Router();
const auth = require('../middleware/auth');

router.use(auth);

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

    const user = await User.findById(userId).select('username avatar');
    res.send({ messages, user });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.get("/conversations", async (req, res) => {
  try {
    const userId = req.user._id;
    const messages = await Message.aggregate([
      { $match: { $or: [{ sender: userId }, { recipient: userId }] } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$sender", userId] },
              then: "$recipient",
              else: "$sender"
            }
          },
          latestMessage: { $first: "$$ROOT" }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      {
        $project: {
          _id: 1,
          "userDetails.username": 1,
          "userDetails.avatar": 1,
          "latestMessage.content": 1,
          "latestMessage.createdAt": 1
        }
      }
    ]);

    res.send(messages.map(m => ({
      _id: m._id,
      username: m.userDetails[0].username,
      avatar: m.userDetails[0].avatar,
      latestMessage: m.latestMessage.content,
      lastMessageTime: m.latestMessage.createdAt
    })));
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

module.exports = router;
