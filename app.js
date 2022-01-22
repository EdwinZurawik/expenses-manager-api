const express = require('express');
const morgan = require('morgan');

const transactionRouter = require('./routes/transactionRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/transactions', transactionRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
