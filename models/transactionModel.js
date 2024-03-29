const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'A transaction must have a name'],
    maxlength: [
      255,
      'A transaction name must have less or equal to 255 characters',
    ],
    minlength: [3, 'A transaction name must have at least 3 characters'],
  },
  amount: {
    type: Number,
    required: [true, 'A transaction must have an amount'],
    min: [0.01, 'A transaction amount must be above 0'],
  },
  type: {
    type: String,
    required: [true, 'A transaction must have a type'],
    enum: {
      values: ['expense', 'income'],
      message: 'A transaction type can be either "expense" or "income"',
    },
  },
  category: {
    type: mongoose.Types.ObjectId,
    ref: 'Category',
    required: [true, 'A transaction must have a category'],
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'A transaction must have a user'],
  },
  accountId: {
    type: mongoose.Types.ObjectId,
    ref: 'Account',
    required: [true, 'A transaction must belong to an account'],
  },
  description: {
    type: String,
    minlength: [3, 'A transaction description must have at least 3 characters'],
    maxlength: [
      255,
      'A transaction description musth have less or equal to 255 characters',
    ],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  date: {
    type: Date,
    required: [true, 'A transaction must have a transaction date'],
  },
});

transactionSchema.pre(/^find/, function (next) {
  this.populate({ path: 'category', select: '-__v -accountId' });
  this.populate({ path: 'user', select: '-__v -accountId' });
  next();
});

// DOCUMENT MIDDLEWARE - runs before .save() and .create() commands
// transactionSchema.pre('save', function (next) {
//   next();
// });

// transactionSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

// // QUERY MIDDLEWARE
// transactionSchema.pre(/^find/, function(next) {
//   next();
// })

// // AGGREGATION MIDDLEWARE
// transactionSchema.pre('aggregation', function (next) {
//   next();
// });

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
