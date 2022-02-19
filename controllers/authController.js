const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const Account = require('../models/accountModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const signToken = function (id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createAndSendToken = (account, statusCode, req, res) => {
  const token = signToken(account._id);

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  });

  account.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      account,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newAccount = await Account.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createAndSendToken(newAccount, 201, req, res);
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

  createAndSendToken(account, 200, req, res);
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

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password an passwordConfirm to: 
  ${resetURL}\nIf you didn't forget your password, please ignore this message.`;

  try {
    await sendEmail({
      email: account.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    account.passwordResetToken = undefined;
    account.passwordResetExpires = undefined;
    await account.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email. Try again later.',
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const account = await Account.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!account) {
    return next(new AppError('Token is invalid or has expired.', 404));
  }

  account.password = req.body.password;
  account.passwordConfirm = req.body.passwordConfirm;
  account.passwordResetToken = undefined;
  account.passwordResetExpires = undefined;
  await account.save();

  createAndSendToken(account, 200, req, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const account = await Account.findById(req.account._id).select('+password');

  if (
    !req.body.currentPassword ||
    !(await account.correctPassword(req.body.currentPassword, account.password))
  ) {
    return next(new AppError('Incorrect password. Please try again.', 401));
  }

  account.password = req.body.password;
  account.passwordConfirm = req.body.passwordConfirm;
  await account.save();

  createAndSendToken(account, 200, req, res);
});
