const fs = require('fs');

const transactions = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/transactions.json`)
);

exports.checkBody = (req, res, next) => {
  requiredKeys = ['name', 'amount'];
  for (key of requiredKeys) {
    if (!(key in req.body)) {
      return res.status(400).json({
        status: 'fail',
        message: `"${key}" attribute is required!`,
      });
    }
  }
  next();
};

exports.checkId = (req, res, next, val) => {
  transaction = transactions.find((el) => el.id === +val);
  if (!transaction) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next();
};

exports.getAllTransactions = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: transactions.length,
    data: {
      transactions,
    },
  });
};

exports.getTransaction = (req, res) => {
  transaction = transactions.find((el) => el.id === +req.params.id);
  res.status(200).json({
    status: 'success',
    data: {
      transaction,
    },
  });
};

exports.createTransaction = (req, res) => {
  console.log(req.body);
  const transactionId = transactions[transactions.length - 1].id + 1;
  const newTransaction = Object.assign({ id: transactionId }, req.body);

  transactions.push(newTransaction);
  fs.writeFile(
    `${__dirname}/dev-data/transactions.json`,
    JSON.stringify(transactions),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          transaction: newTransaction,
        },
      });
    }
  );
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
