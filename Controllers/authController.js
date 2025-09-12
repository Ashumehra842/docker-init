const { promisify } = require('util');
const catchAsync = require('./../utils/catchAsync');
const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/appError');

exports.signup = catchAsync(async (req, res, next) => {


    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        photo: req.body.photo,
        role: req.body.role,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });

    res.status(200).json({
        status: 'success',
        message: 'user created successfully.',
        token: token,
        data: {
            data: newUser
        }
    });
});

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    console.log(req.body);
    if (!email || !password) {
        return next(new AppError('Please provide the valid email and password', 400));
    }
    const user = await User.findOne({ email }).select("password");

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('incorrect email and password'), 401);
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });

    res.status(200).json({
        status: 'success',
        token,
        data:user
    });
}

// Delete user
exports.deleteUser = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
        status: 'success',
        message: 'user deleted successfully.'
    });
});

exports.protect = catchAsync(async (req, res, next) => {

    //1) get token and check if exists
    //2) validate token
    //3) check if user still exists
    //4) check if user change password after jwt token generate
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('You are not logged in! please log in to get access'), 401);
    }
    // below function return the output from token and verify the token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // check if user still exists
    const freshUser = await User.findById(decoded.id);
    console.log(freshUser);
    if (!freshUser) {

        return next(new AppError('The User belonging to this token does no longer exists.', 401));
    }
    req.user = freshUser;
    next();
});

// Roles and permissions.
exports.restrictedTo = (...roles) => {
    return (req, res, next) => {
        // roles in ['user','lead-guide', 'admin'] it might be admin or user
        if (!roles.includes(req.user.role)) {
            return next(new AppError(`You don't have permission to this action`, 403));
        }
        next();
    }
}
