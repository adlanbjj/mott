const express = require('express');
const Posts = require('../models/Posts');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const router = express.Router();

router.post('/create', auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = new Posts({
      title,
      content,
      author: req.user._id
    });

    await post.save();
    const populatedPost = await Posts.findById(post._id).populate('author', 'username');
    res.status(201).send(populatedPost);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const posts = await Posts.find().sort({ createdAt: -1 })
      .populate('author', 'username')
      .populate('comments.author', 'username');
    res.status(200).send(posts);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id)
      .populate('author', 'username')
      .populate('comments.author', 'username');
    if (!post) {
      return res.status(404).send({ error: 'Post not found' });
    }
    res.send(post);
  } catch (error) {
    res.status(500).send({ error: 'Server error' });
  }
});

router.patch('/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['title', 'content'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const post = await Posts.findById(req.params.id);

    if (!post) {
      return res.status(404).send();
    }

    if (!req.user.isAdmin && post.author.toString() !== req.user._id.toString()) {
      return res.status(403).send({ error: 'Permission denied' });
    }

    updates.forEach(update => post[update] = req.body[update]);
    await post.save();
    const populatedPost = await Posts.findById(post._id)
      .populate('author', 'username')
      .populate('comments.author', 'username');
    res.send(populatedPost);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);

    if (!post) {
      return res.status(404).send({ error: 'Post not found' });
    }

    if (!req.user.isAdmin && post.author.toString() !== req.user._id.toString()) {
      return res.status(403).send({ error: 'Permission denied' });
    }

    await post.deleteOne(); 
    res.send({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.post('/:id/comments', auth, async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);

    if (!post) {
      return res.status(404).send({ error: 'Post not found' });
    }

    if (!req.body.content) {
      return res.status(400).send({ error: 'Content is required' });
    }

    const comment = {
      content: req.body.content,
      author: req.user._id
    };

    post.comments.push(comment);
    await post.save();
    const populatedPost = await Posts.findById(post._id)
      .populate('author', 'username')
      .populate('comments.author', 'username');
    res.status(201).send(populatedPost);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    if (!post) {
      return res.status(404).send({ error: 'Post not found' });
    }

    if (!post.likes.some(like => like.toString() === req.user._id.toString())) {
      post.likes.push(req.user._id);
      post.dislikes.pull(req.user._id);
    } else {
      post.likes.pull(req.user._id);
    }

    await post.save();

    const populatedPost = await Posts.findById(post._id)
      .populate('author', 'username')
      .populate('comments.author', 'username');
    res.status(200).send(populatedPost);
  } catch (error) {
    res.status(500).send({ error: 'Server error' });
  }
});

router.post('/:id/dislike', auth, async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    if (!post) {
      return res.status(404).send({ error: 'Post not found' });
    }

    if (!post.dislikes.includes(req.user._id)) {
      post.dislikes.push(req.user._id);
      post.likes.pull(req.user._id);
    } else {
      post.dislikes.pull(req.user._id);
    }

    await post.save();

    const populatedPost = await Posts.findById(post._id)
      .populate('author', 'username')
      .populate('comments.author', 'username');
    res.status(200).send(populatedPost);
  } catch (error) {
    res.status(500).send({ error: 'Server error' });
  }
});

module.exports = router;
