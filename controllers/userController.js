const User = require('../models/userModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const filterObj = (obj, ...allowedFields) => {
  let tmp_obj = { ...obj };
  Object.keys(tmp_obj).forEach(key => {
    if (!allowedFields.includes(key)) delete tmp_obj[key];
  });
  return tmp_obj;
};

exports.getAllUsers = catchAsync(async (req, res) => {
  const feature = new APIFeatures(User.find({}), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const users = await feature.query;

  res.status(500).json({
    status: 'error',
    users,
    message: 'This route is not yet defined!'
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1. Ensure no password is coming in
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'You cannot update password on this route. Use /updateMyPassword instead'
      )
    );
  }

  // 2. Filter out field names that are not allowed to be editted
  const filteredBody = filterObj(req.body, 'name', 'email');

  // 3. Update user document
  const user = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
