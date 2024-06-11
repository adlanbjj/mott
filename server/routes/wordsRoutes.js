const express = require('express');
const router = express.Router();
const Words = require('../models/Words');

router.get('/all', async (req, res) => {
  try {
    const words = await Words.find({});
    res.status(200).send(words);
  } catch (error) {
    res.status(500).send({ message: 'Ошибка при получении слов', error });
  }
});

module.exports = router;
