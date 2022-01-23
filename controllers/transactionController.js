const Transaction = require('../models/transactionModel');

exports.checkBody = (req, res, next) => {
  // requiredKeys = ['name', 'amount'];
  // for (key of requiredKeys) {
  //   if (!(key in req.body)) {
  //     return res.status(400).json({
  //       status: 'fail',
  //       message: `"${key}" attribute is required!`,
  //     });
  //   }
  // }
  next();
};

exports.getAllTransactions = (req, res) => {
  res.status(200).json({
    status: 'success',
    // results: transactions.length,
    // data: {
    //   transactions,
    // },
  });
};

exports.getTransaction = (req, res) => {
  res.status(200).json({
    // status: 'success',
    // data: {
    //   transaction,
    // },
  });
};

exports.createTransaction = (req, res) => {
  res.status(201).json({
    // status: 'success',
    // data: {
    //   transaction: newTransaction,
    // },
  });
};

exports.updateTransaction = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      transaction: 'Updated transaction here!',
    },
  });
};

exports.deleteTransaction = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
