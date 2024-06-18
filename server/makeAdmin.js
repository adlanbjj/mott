const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb+srv://user:user@cluster0.d1dcnfd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to the database');
}).catch((error) => {
  console.error('Error connecting to the database', error);
});

const makeAdmin = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.error('User not found');
      return;
    }

    user.isAdmin = true;
    await user.save();
    console.log(`User ${user.username} is now an admin`);
  } catch (error) {
    console.error('Error updating user', error);
  } finally {
    mongoose.disconnect();
  }
};

const userId = '666ddc6fde2f7c224354d921';

makeAdmin(userId);
