const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'A user must have a name'],
    unique: [true, 'A user name must be unique'],
    maxlength: [255, 'A user name must have less or equal to 255 characters'],
    minlength: [3, 'A user name must have at least 3 characters'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [
      255,
      'A user descritpion must have less or equal to 255 characters',
    ],
    minlength: [3, 'A user descritpion must have at least 3 characters'],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
  },
  accountId: {
    type: mongoose.Types.ObjectId,
    required: [true, 'A user must be assigned to an account'],
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
