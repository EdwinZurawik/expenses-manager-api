const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'A category must have a name'],
    maxlength: [
      255,
      'A category name must have less or equal to 255 characters',
    ],
    minlength: [3, 'A category name must have at least 3 characters'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [
      255,
      'A category descritpion must have less or equal to 255 characters',
    ],
    minlength: [3, 'A category descritpion must have at least 3 characters'],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
  },
  type: {
    type: String,
    required: [true, 'A category must have a type'],
    enum: {
      values: ['expense', 'income'],
      message: 'A category type can be either "expense" or "income"',
    },
  },
  accountId: {
    type: mongoose.Types.ObjectId,
    ref: 'Account',
    required: [true, 'A category must be assigned to an account'],
  },
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
