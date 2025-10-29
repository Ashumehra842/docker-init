const { promisify } = require("util");
const catchAsync = require("./../utils/catchAsync");
const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const AppError = require("./../utils/appError");
const sendEmail = require("./../utils/email");

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
}

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    // Below cookies is for web pages to send store and receive back the jwt token
    const cookieOtions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };
    if (process.env.NODE_ENV === 'production') cookieOtions.secure = true;

    res.cookie("jwt", token, cookieOtions);
    user.password = undefined; // to not show password in signup response
    res.status(statusCode).json({
        status: "success",
        message: "user created successfully.",
        token: token,
        data: {
            data: user,
        },
    });
};
exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        photo: req.body.photo,
        role: req.body.role,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangeAt: req.body.passwordChangeAt,
    });

    createSendToken(newUser, 201, res);
});

exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(
            new AppError("Please provide the valid email and password", 400)
        );
    }
    const user = await User.findOne({ email }).select("password");

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError("incorrect email and password"), 401);
    }

    createSendToken(user, 200, res);
};

// Delete user
exports.deleteUser = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
        status: "success",
        message: "user deleted successfully.",
    });
});

exports.protect = catchAsync(async (req, res, next) => {
    //1) get token and check if exists

    //3) check if user still exists
    //4) check if user change password after jwt token generate
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }
    //2) validate token
    if (!token) {
        return next(
            new AppError("You are not logged in! please log in to get access"),
            401
        );
    }
    // below function return the output from token and verify the token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // check if user still exists
    const freshUser = await User.findById(decoded.id).select("+password");

    if (!freshUser) {
        return next(
            new AppError(
                "The User belonging to this token does no longer exists.",
                401
            )
        );
    }

    if (freshUser.changePasswordAfter(decoded.iat)) {
        return next(
            new AppError("User recently change password! Please login again.", 401)
        );
    }
    req.user = freshUser;
    next();
});

// Roles and permissions.
exports.restrictedTo = (...roles) => {
    return (req, res, next) => {
        // roles in ['user','lead-guide', 'admin'] it might be admin or user
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError(`You don't have permission to this action`, 403)
            );
        }
        next();
    };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError(`Email is invalid.`, 404));
    }
    const resetToken = user.createPasswordResetToken();

    await user.save({ validateBeforeSave: false });
    //generate rendom token to reset password
    const resetURL = `${req.protocol}://${req.get(
        "host"
    )}/v1/user/resetPassword/${resetToken}`;

    const message = `Forget your password? submit a patch request with your new password and ConfirmPassword to ${resetURL}\n`;

    try {
        await sendEmail({
            email: "ashumehra768@outlook.com",
            subject: "your password reset token",
            message: message,
        });
        return res.status(200).json({
            status: "success",
            message: "reset token send to your register email address.",
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await User.save({ validateBeforeSave: false });
        return next(
            new AppError("There ware Error while sending email. Tyr Later.", 500)
        );
    }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
    // 1) get user based on the token

    const plainToken = req.params.token;
    const hashedToken = crypto
        .createHash("sha256")
        .update(plainToken)
        .digest("hex");
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });

    // 2) if token has not expired, and there is user, set new password
    if (!user) {
        return next(new AppError("Token is invalid or expired.", 500));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    createSendToken(user, 200, res);
    // 3) update change password property
    // 4) log the user in, and send jwt
});



exports.updatePassword = catchAsync(async (req, res, next) => {
    // 1) get user from collection
    const user = await User.findById(req.user.id).select("+password");

    // 2) current Posted password is correct

    if (!(await user.correctPassword(req.body.passwordCurrent, req.user.password))) {
        return next(new AppError(`Your Current Password is Wrong.`, 401));
    }


    // 3) if so update function
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    createSendToken(user, 200, res);
    // 4) Log user In ans send JWT Token
});
