const mongoose = require("mongoose");
const crypto = require("crypto"); // it's built-in package
const validator = require("validator");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please provide the valid email address"],
    },
    photo: {
        type: String,
        required: [true, "Photo is required"],
    },
    role: {
        type: String,
        enum: ["user","guide", "lead-guide", "admin"],
        default: "user",
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: 8,
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, "Confirm Password is required"],
        validate: {
            // this work only on create and save
            validator: function (el) {
                return el === this.password;
            },
            message: "Password and confirm Password are not same.",
        },
    },
    passwordChangeAt: {
        type: Date,
    },
    passwordResetToken: {
        type: String,
    },
    passwordResetExpires: {
        type: Date,
    },
    active: {
        type: Boolean,
        default: true,
        select: false
    }
});

userSchema.pre("save", async function (next) {
    /**Only run this function if password was actually modified */
    if (!this.isModified("password")) return next();
    // hash password
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined; // this is because password and confirm password checked above we no need to save the c_password
    next();
});

userSchema.pre("save", function (next) {
    if (!this.isModified("password") || this.isNew) return next();

    this.passwordChangeAt = Date.now() - 1000;
    next();
});

userSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } });
    next();
});

//compare password while login
userSchema.methods.correctPassword = async function (
    candidatepassword,
    userPassword
) {
    return await bcrypt.compare(candidatepassword, userPassword);
};

userSchema.methods.changePasswordAfter = function (JWTTimestemp) {
    // compare if passwordChangeAt property is present
    if (this.passwordChangeAt) {
        const changeTimestemp = parseInt(
            this.passwordChangeAt.getTime() / 1000,
            10
        );

        return JWTTimestemp < changeTimestemp;
    }
    // FALSE mean password not change
    return false;
};

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
