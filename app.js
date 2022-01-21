const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('dev'));
app.use(express.json());

const transactions = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/transactions.json`)
);

const getAllTransactions = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: transactions.length,
    data: {
      transactions,
    },
  });
};

const getTransaction = (req, res) => {
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

const createTransaction = (req, res) => {
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

const updateTransaction = (req, res) => {
  // Check if tour with given id exists...
  res.status(200).json({
    status: 'success',
    data: {
      tour: 'Updated tour here!',
    },
  });
};

const deleteTransaction = (req, res) => {
  // Check if tour with given id exists...
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

app.get('/api/v1/transactions', getAllTransactions);
app.get('/api/v1/transactions/:id', getTransaction);
app.post('/api/v1/transactions', createTransaction);
app.patch('/api/v1/transactions/:id', updateTransaction);
app.delete('/api/v1/transactions/:id', deleteTransaction);

port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}...`);
});
