const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const User = require('./../models/userModel');

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};
exports.updateMe = catchAsync(async (req, res, next) => {

    // 1) create error if user post password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError(`This route is not for password update! please use update my password`, 400));

    }

    const filteredBody = filterObj(req.body, 'name', 'email');
    const updateuser = await User.findByIdAndUpdate(req.user.id, filteredBody, { new: true, runValidators: true });
    return res.status(200).json({
        status: 'success',
        message: 'user data updated successfully.',
        data: {
            user: updateuser
        }
    });
    // 2) update user data

});

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    return res.status(204).json({
        status:'success',
        message: 'User deleted successfully.',
        data:null
    });
});