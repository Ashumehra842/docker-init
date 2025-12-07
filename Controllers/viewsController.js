const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Tour = require("./../models/tourModel");
exports.base = catchAsync(async (req, res, next) => {
  res.status(200).render("base", {
    tour: "All Tours",
  });
});
exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();

  res.status(200).render("overview", {
    title: "All Tours",
    tours: tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    fields: "review rating user",
  });
  // console.log(tour );
  if (!tour) {
    return next(new AppError("There is no tour with is name", 404));
  }
  res.status(200).render("tour", {
    title: tour.name,
    tour,
  });
});

exports.getLoginForm = catchAsync(async (req, res, next) => {
  res.status(200).render("login", {
    title: "Login",
  });
});

exports.logout = catchAsync(async (req, res, next) => {
  res.cookie("jwt", "logout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: "success",
  });
}); 
exports.getAccount = catchAsync(async(req, res, next) =>{
   
    res.status(200).render('account',{
        title:'Account'
    });
}); 

exports.updateUserData = catchAsync(async(req,res, next)=>{
    const UpdatedUser = await User.findByIdAndUpdate(req.user.id, {
        name:req.body.name,
        email:req.body.email
    },{
        new:true,
        runValidators:true
    });

    if(!UpdatedUser){
        return next(new AppError('Failed to update user data', 401));
    } 
 
    res.status(200).render('account',{
        title:'Account',
        user:UpdatedUser
    });

}); 