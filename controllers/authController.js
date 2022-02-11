const Account = require('../models/accountModel');
const catchAsync = require('../utils/catchAsync');

exports.signup = catchAsync(async (req, res, next) => {
  const newAccount = await Account.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      account: newAccount,
    },
  });
});
