const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'A transaction must have a name'],
  },
  amount: {
    type: Number,
    required: [true, 'A transaction must have an amount'],
  },
  type: {
    type: String,
    required: [true, 'A transaction must have a type'],
  },
  categoryId: mongoose.Types.ObjectId,
  userId: {
    type: mongoose.Types.ObjectId,
    required: [true, 'A transaction must have a user'],
  },
  description: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  date: {
    type: Date,
    required: [true, 'A transaction must have a transaction date'],
  },
});
const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
