const fs = require('fs');

const transactions = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/transactions.json`)
);

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
  const id = +req.params.id;
  transaction = transactions.find((el) => el.id === id);

  if (!transaction) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  } else {
    res.status(200).json({
      status: 'success',
      data: {
        transaction,
      },
    });
  }
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
  // Check if transaction with given id exists...
  res.status(200).json({
    status: 'success',
    data: {
      transaction: 'Updated transaction here!',
    },
  });
};

exports.deleteTransaction = (req, res) => {
  // Check if transaction with given id exists...
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
