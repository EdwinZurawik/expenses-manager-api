const fs = require('fs');
const express = require('express');

const app = express();

app.use(express.json());

const expenses = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/expenses.json`)
);

app.get('/api/v1/expenses', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: expenses.length,
    data: {
      expenses,
    },
  });
});

app.get('/api/v1/expenses/:id', (req, res) => {
  const id = +req.params.id;
  expense = expenses.find((el) => el.id === id);

  if (!expense) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  } else {
    res.status(200).json({
      status: 'success',
      data: {
        expense,
      },
    });
  }
});

app.post('/api/v1/expenses', (req, res) => {
  console.log(req.body);
  const expenseId = expenses[expenses.length - 1].id + 1;
  const newExpense = Object.assign({ id: expenseId }, req.body);

  expenses.push(newExpense);
  fs.writeFile(
    `${__dirname}/dev-data/expenses.json`,
    JSON.stringify(expenses),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          expense: newExpense,
        },
      });
    }
  );
});

app.patch('/api/v1/expenses/:id', (req, res) => {
  // Check if tour with given id exists...
  res.status(200).json({
    status: 'success',
    data: {
      tour: 'Updated tour here!',
    },
  });
});

app.delete('/api/v1/expenses/:id', (req, res) => {
  // Check if tour with given id exists...
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}...`);
});
