const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');
const cors = require('cors');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const transactionRouter = require('./routes/transactionRoutes');
const userRouter = require('./routes/userRoutes');
const accountRouter = require('./routes/accountRoutes');
const categoryRouter = require('./routes/categoryRoutes');
const billRouter = require('./routes/billRoutes');
const debtRouter = require('./routes/debtRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

app.enable('trust proxy');

// Implement CORS
app.use(cors());

app.options('*', cors());

// Set security HTTP Headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same IP
const limiter = rateLimit({
  max: process.env.MAX_NUM_REQUESTS,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});

app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: ['amount', 'type', 'categoryId', 'userId'],
  })
);

// Compress text sent to the client
app.use(compression());

app.get('/', (req, res) => {
  res.status(200).render('base');
});

app.use('/api/v1/transactions', transactionRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/bills', billRouter);
app.use('/api/v1/debts', debtRouter);
app.use('/api/v1/accounts', accountRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
