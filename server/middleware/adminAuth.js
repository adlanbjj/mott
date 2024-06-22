const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const adminAuth = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).send({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || !user.isAdmin) {
      throw new Error('Not an admin');
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate as admin.' });
  }
};

module.exports = adminAuth;
