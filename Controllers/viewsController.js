const catchAsync = require("../utils/catchAsync");
const Tour = require('./../models/tourModel');
exports.base = catchAsync(async (req, res, next) => {

    res.status(200).render('base', {
        tour: 'All Tours'
    });

});
exports.getOverview = catchAsync(async (req, res, next) => {
    const tours = await Tour.find();
    
    res.status(200).render('overview', {
        title: 'All Tours',
        tours:tours,
      
    });

});

exports.getTour = catchAsync(async (req, res, next) => {

    res.status(200).render('tour', {
        title: 'The Forest Hiker Tour'
    });

});

