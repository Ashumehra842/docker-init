const catchAsync = require('../utils/catchAsync');
const Review = require('./../models/reviewModel');

exports.createReview = catchAsync(async (req, res, next) => {

  const data = await Review.create(req.body);
  res.status(200).json({
    status: 'success',
    message: 'Review created successfully.',
    data: data
  });
});

exports.getReview = catchAsync(async (req, res, next) => {
  const data = await Review.find();
  res.status(200).json({
    status: 'success',
    message: 'Review list view successfully.',
    count: data.length,
    data: data
  });
});
