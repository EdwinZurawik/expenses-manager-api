const Transaction = require('../models/transactionModel');
const APIFeatures = require('../utils/apiFeatures');

exports.aliasTopExpenses = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-amount,-date';
  req.query.type = 'expense';
  req.query.fields = 'name,type,amount,date';
  next();
};

exports.getAllTransactions = async (req, res) => {
  try {
    const features = new APIFeatures(Transaction.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const transactions = await features.query;
    res.status(200).json({
      status: 'success',
      results: transactions.length,
      data: {
        transactions,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        transaction,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.createTransaction = async (req, res) => {
  try {
    const newTransaction = await Transaction.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        transaction: newTransaction,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.status(200).json({
      status: 'success',
      data: {
        transaction,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTransactionStats = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getMonthlyReport = async (req, res) => {
  const year = req.query.year * 1;
  try {
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
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
