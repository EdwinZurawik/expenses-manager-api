const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
      message: 'Please provide a valid email',
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
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
});

accountSchema.pre('save', async function (next) {
  // Run function only when password modified
  if (!this.isModified('password')) return next();

  // hash the password with the cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  // remove passwordConfirm
  this.passwordConfirm = undefined;
  next();
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
