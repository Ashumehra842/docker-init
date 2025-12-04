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

    const tour = await Tour.findOne({slug: req.params.slug}).populate({
        path:'reviews',
        fields:'review rating user'
    });
    // console.log(tour );
    res.status(200).render('tour', {
        title: tour.name,
        tour
    });

});

exports.getLoginForm = catchAsync(async(req, res, next)=>{

    res.status(200).render('login',{
        title: 'Login'
    });
});

exports.logout =  catchAsync(async(req, res, next)=>{
    res.cookie('jwt', 'loggedout',{
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly:true
    });
    res.status(200).json({
        status:'success'

    });
});


