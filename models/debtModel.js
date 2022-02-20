const mongoose = require('mongoose');
const Bill = require('./billModel');

const getBill = async function (billId) {
  return await Bill.findById(billId);
};

const checkIfInBorrowers = async function (billId, borrowerId) {
  const bill = await getBill(billId);
  const borrowerIds = bill.transactions.map(
    (transaction) => transaction.user._id
  );

  return borrowerIds.includes(borrowerId);
};

const checkifNotPayer = async function (billId, borrowerId) {
  const bill = await getBill(billId);

  return !borrowerId.equals(bill.payer._id);
};

const debtSchema = new mongoose.Schema(
  {
    bill: {
      type: mongoose.Types.ObjectId,
      ref: 'Bill',
      required: [true, 'A debt must belong to a bill'],
    },
    accountId: {
      type: mongoose.Types.ObjectId,
      ref: 'Account',
      required: [true, 'A debt must be assigned to an account'],
    },
    payedOff: {
      type: Boolean,
      default: false,
    },
    borrower: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'A debt must have a borrower'],
      validate: [
        {
          validator: function (value) {
            return checkifNotPayer(this.bill, value);
          },
          message: 'A person who payed the bill cannot be a borrower',
        },
        {
          validator: function (value) {
            return checkIfInBorrowers(this.bill, value);
          },
          message: 'A borrower must be on the bill transactions list',
        },
      ],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    date: {
      type: Date,
      required: [true, 'A debt must have a debt date'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

debtSchema.index({ bill: 1, borrower: 1 }, { unique: true });

debtSchema.virtual('amountToPay').get(function () {
  let totalAmount = 0;
  if (this.bill && this.bill.transactions) {
    const amounts = this.bill.transactions.map((transaction) => {
      if (this.borrower.equals(transaction.user._id)) return transaction.amount;
      return 0;
    });
    totalAmount = amounts.reduce(
      (previousValue, currentValue) => previousValue + currentValue,
      0
    );
  }
  return Math.round(totalAmount * 100) / 100;
});

debtSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'bill',
    select: '-__v -accountId',
  });
  this.populate({ path: 'borrower', select: '-__v -accountId' });
  next();
});

const Debt = mongoose.model('Debt', debtSchema);

module.exports = Debt;
