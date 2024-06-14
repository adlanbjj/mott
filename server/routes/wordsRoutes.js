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

router.get('/:wordId', async (req, res) => {
  try {
    const word = await Words.findById(req.params.wordId);
    if (!word) {
      return res.status(404).send({ message: 'Слово не найдено' });
    }
    res.status(200).send(word);
  } catch (error) {
    res.status(500).send({ message: 'Ошибка при получении слова', error });
  }
});

module.exports = router;
