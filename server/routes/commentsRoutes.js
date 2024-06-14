const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const auth = require('../middleware/auth');
const Words = require('../models/Words');

// Get words commented by the user
router.get('/commented', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const comments = await Comment.find({ userId }).distinct('wordId');
    const words = await Words.find({ _id: { $in: comments } });
    res.status(200).send(words);
  } catch (error) {
    console.error('Error fetching commented words:', error); // Log the error
    res.status(500).send({ message: 'Error fetching commented words', error });
  }
});

// Add a comment
router.post('/add-post', auth, async (req, res) => {
  const { wordId, content } = req.body;
  const userId = req.user._id;
  try {
    const newComment = new Comment({ wordId, userId, content });
    await newComment.save();
    res.status(201).send(newComment);
  } catch (error) {
    console.error('Error adding comment:', error); // Log the error
    res.status(500).send({ message: 'Error adding comment', error });
  }
});

// Get comments for a word
router.get('/:wordId', async (req, res) => {
  const { wordId } = req.params;
  try {
    const comments = await Comment.find({ wordId }).populate('userId', 'username');
    res.status(200).send(comments);
  } catch (error) {
    console.error('Error fetching comments:', error); // Log the error
    res.status(500).send({ message: 'Error fetching comments', error });
  }
});

// Update a comment
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const userId = req.user._id;
  try {
    const comment = await Comment.findOne({ _id: id, userId });
    if (!comment) {
      return res.status(404).send({ message: 'Comment not found or you do not have permission to edit it' });
    }
    comment.content = content;
    comment.updatedAt = Date.now();
    await comment.save();
    res.status(200).send(comment);
  } catch (error) {
    console.error('Error updating comment:', error); // Log the error
    res.status(500).send({ message: 'Error updating comment', error });
  }
});

// Delete a comment
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  try {
    const comment = await Comment.findOneAndDelete({ _id: id, userId });
    if (!comment) {
      return res.status(404).send({ message: 'Comment not found or you do not have permission to delete it' });
    }
    res.status(200).send({ message: 'Comment deleted' });
  } catch (error) {
    console.error('Error deleting comment:', error); // Log the error
    res.status(500).send({ message: 'Error deleting comment', error });
  }
});

module.exports = router;
