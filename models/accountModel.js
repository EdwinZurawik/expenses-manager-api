const mongoose = require('mongoose');
const validator = require('validator');

const accountSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    required: [true, 'An account must have a username'],
    unique: [true, 'A username must be unique'],
    maxlength: [255, 'A username must have less or equal to 255 characters'],
    minlength: [3, 'A username must have at least 3 characters'],
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: [true, 'An account must have an email'],
    unique: [true, 'An email assigned to an account must be unique'],
    validate: {
      validator: validator.isEmail,
      message: (props) => `${props.value} is not a valid email`,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'A password should have at least 8 characters'],
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
  },
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
