const { promisify } = require('util');
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

  if (!email || !password) {
    return next(new AppError('Please provide an email and a password!', 400));
  }

  const account = await Account.findOne({ email }).select('+password');

  if (
    !account ||
    !(await account.correctPassword(password, account.password))
  ) {
    return next(new AppError('Incorrect email or password!', 401));
  }

  const token = signToken(account._id);

  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('You are not logged in. Please log in to get access.', 401)
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentAccount = await Account.findById(decoded.id);
  if (!currentAccount) {
    return next(
      new AppError(
        'The account belonging to this token does not longer exist.',
        401
      )
    );
  }

  if (currentAccount.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'User has recently changed password. Please log in again.',
        401
      )
    );
  }

  req.account = currentAccount;
  next();
});

exports.restrictTo = function (...roles) {
  return function (req, res, next) {
    if (!roles.includes(req.account.role)) {
      return next(
        new AppError('You do not have permission to perform this action.', 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const account = await Account.findOne({ email: req.body.email });
  if (!account) {
    return next(
      new AppError('There is no account with that email address.', 404)
    );
  }
  const resetToken = account.createPasswordResetToken();
  await account.save({ validateBeforeSave: false });
});
exports.resetPassword = catchAsync(async (req, res, next) => {});
