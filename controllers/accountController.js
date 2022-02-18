const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const Account = require('../models/accountModel');
const AppError = require('../utils/appError');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates! Please use /updateMyPassword.',
        400
      )
    );
  }

  const filteredBody = filterObj(req.body, 'username', 'email');
  const updatedAccount = await Account.findByIdAndUpdate(
    req.account._id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: 'success',
    data: { account: updatedAccount },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await Account.findByIdAndUpdate(req.account._id, {
    active: false,
  });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getAllAccounts = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Account.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const accounts = await features.query;

  res.status(200).json({
    status: 'success',
    results: accounts.length,
    data: {
      accounts,
    },
  });
});

exports.getAccount = catchAsync(async (req, res, next) => {
  const account = await Account.findById(req.params.id);

  if (!account) {
    return next(new AppError('No account found with that ID.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { account },
  });
});
