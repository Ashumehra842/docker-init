const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide the valid email address']
    },
    photo: {
        type: String,
        required: [true, 'Photo is required']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 8
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Confirm Password is required'],
        validate: {
            // this work only on create and save 
            validator: function (el) {
                return el === this.password;
            },
            message: 'Password and confirm Password are not same.'
        }
    }
});


userSchema.pre('save', async function (next) {
    /**Only run this function if password was actually modified */
    if (!this.isModified('password')) return next();
// hash password
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined; // this is because password and confirm password checked above we no need to save the c_password
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;