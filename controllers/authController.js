const jwt = require('jsonwebtoken');
const Account = require('../models/accountModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = function (id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newAccount = await Account.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signToken(newAccount._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      account: newAccount,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email, password);

  if (!email || !password) {
    return next(new AppError('Please provide an email and a password!', 400));
  }

  const account = await Account.findOne({ email }).select('+password');

  if (
    !account ||
    !(await account.correctPassword(password, account.password))
  ) {
    return next(new AppError('Incorrect email or password!'), 401);
  }

  const token = signToken(account._id);

  res.status(200).json({
    status: 'success',
    token,
  });
});
