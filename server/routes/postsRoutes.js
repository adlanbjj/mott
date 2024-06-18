const express = require('express');
const Posts = require('../models/Posts');
const auth = require('../middleware/auth');
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
    res.status(201).send(post);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const posts = await Posts.find().sort({ createdAt: -1 }).populate('author', 'username');
    res.status(200).send(posts);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id).populate('author', 'username').populate('comments.author', 'username');
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
    const post = await Posts.findOne({ _id: req.params.id, author: req.user._id });

    if (!post) {
      return res.status(404).send();
    }

    updates.forEach(update => post[update] = req.body[update]);
    await post.save();
    res.send(post);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Posts.findOneAndDelete({ _id: req.params.id, author: req.user._id });

    if (!post) {
      return res.status(404).send();
    }

    res.send(post);
  } catch (error) {
    res.status(500).send(error);
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
    const populatedPost = await Posts.findById(post._id).populate('comments.author', 'username');
    res.status(201).send(populatedPost);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

module.exports = router;
