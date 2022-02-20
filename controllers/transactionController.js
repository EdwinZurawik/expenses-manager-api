const Transaction = require('../models/transactionModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.aliasTopExpenses = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-amount,-date';
  req.query.type = 'expense';
  req.query.fields = 'name,type,amount,date';
  next();
};

exports.getAllTransactions = factory.getAll(Transaction);
exports.getTransaction = factory.getOne(Transaction);
exports.createTransaction = factory.createOne(Transaction);
exports.updateTransaction = factory.updateOne(Transaction);
exports.deleteTransaction = factory.deleteOne(Transaction);

exports.getTransactionStats = catchAsync(async (req, res, next) => {
  const stats = await Transaction.aggregate([
    // {
    //   $match: { createdAt: { $lte: Date.now() } },
    // },
    {
      $group: {
        _id: '$type',
        sumAmount: { $sum: '$amount' },
        countOperations: { $sum: 1 },
        maxAmount: { $max: '$amount' },
        minAmount: { $min: '$amount' },
      },
    },
  ]);
  res.status(200).json({
    status: 'success',
    stats,
  });
});

exports.getMonthlyReport = catchAsync(async (req, res, next) => {
  const year = req.query.year * 1;
  const report = await Transaction.aggregate([
    {
      $match: {
        date: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$date' },
        expensesCount: {
          $sum: { $cond: [{ $eq: ['$type', 'expense'] }, 1, 0] },
        },
        incomesCount: {
          $sum: { $cond: [{ $eq: ['$type', 'income'] }, 1, 0] },
        },
        expensesSum: {
          $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] },
        },
        incomesSum: {
          $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] },
        },
      },
    },
    {
      $addFields: {
        month: '$_id',
        balance: { $subtract: ['$incomesSum', '$expensesSum'] },
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      report,
    },
  });
});
