const mongoose = require('mongoose');

const billSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'A bill must have a name'],
      maxlength: [255, 'A bill name must have less or equal to 255 characters'],
      minlength: [3, 'A bill name must have at least 3 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [
        255,
        'A bill descritpion must have less or equal to 255 characters',
      ],
      minlength: [3, 'A bill descritpion must have at least 3 characters'],
      createdAt: {
        type: Date,
        default: Date.now(),
        select: false,
      },
    },
    payer: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'A bill must have a payer'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    date: {
      type: Date,
      required: [true, 'A bill must have a bill date'],
    },
    transactions: {
      type: [mongoose.Types.ObjectId],
      ref: 'Transaction',
      validate: {
        validator: (value) => Array.isArray(value) && value.length > 0,
        message: 'A bill must have at least one transaction',
      },
      unique: true,
      // TODO add validating for unique array elements
    },
    accountId: {
      type: mongoose.Types.ObjectId,
      ref: 'Account',
      required: [true, 'A bill must be assigned to an account'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

billSchema.virtual('totalAmount').get(function () {
  const amounts = this.transactions.map((transaction) => transaction.amount);
  const totalAmount = amounts.reduce(
    (previousValue, currentValue) => previousValue + currentValue,
    0
  );
  return Math.round(totalAmount * 100) / 100;
});

billSchema.pre(/^find/, function (next) {
  this.populate({ path: 'transactions', select: '-__v -accountId' });
  this.populate({ path: 'payer', select: '-__v -accountId' });
  next();
});

const Bill = mongoose.model('Bill', billSchema);

module.exports = Bill;
