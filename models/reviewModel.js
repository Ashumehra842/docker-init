// review / rating / createdAt / ref to tour / ref to user
const mongoose = require('mongoose');
const Tour = require('./tourModel');
const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, "review can not be empty"]
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, "ratings is required"]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Review must be belongs to Tour.']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Review must belng to a User.']
  },

},
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'tour',
    select: 'name'
  }).populate({
    path: 'user',
    select: 'name photo'
  });
  next();
});
const review = mongoose.model('review', reviewSchema);
module.exports = review;