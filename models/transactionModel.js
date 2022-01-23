const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  name: {
    type: String,
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
  category: String,
});
const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
