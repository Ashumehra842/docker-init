const { message } = require('statuses');
const dashboardModel = require('../models/DashboardModel');
const dasboardModel = require('../models/DashboardModel');
const catchAsync = require('./../utils/catchAsync');
const multer =  require('multer');
const path = require('path');
module.exports.index = (req, res) => {

    res.end("Welcome to the Dashboard from controller.");
}

module.exports.saveUser = catchAsync(async (req, res, next) => {

    const Model = dashboardModel(req.body);
    const data = await Model.save();
    if (data) {
        res.status(200).json({
            status: 'success',
            message: 'User saved successfully.',
            data: data
        });
    }

});

/** get users By Id data */
module.exports.getUserById = catchAsync(async (req, res) => {
    const Model = dasboardModel;


    const data = await Model.findById({ _id: req.params.id });
    return res.status(200).json({
        status: 200,
        message: 'User data view successfully.',
        data: data
    });
});

/**get all users */

module.exports.getAllUsers = async (req, res) => {
    try {
        const model = dasboardModel;
        const data = await model.find();
        return res.status(200).json({
            status: 'success',
            message: 'List data view successfully.',
            data: data
        });
    } catch (err) {
        return res.status(302).json({
            status: 'error',
            error: err.message
        });
    }
};

/**Update User data */

module.exports.updateUser = async (req, res) => {
    try {

        const userId = req.params.id;
        const data = await dasboardModel.findByIdAndUpdate(userId, req.body);
        if (data) {
            return res.status(200).json({
                status: 'success',
                message: 'User Data Updated Successfully.',
                data: data
            });
        }

    } catch (err) {
        return res.status(302).json({
            status: 'error',
            error: err.message
        });
    }
};

/*upload user images */

module.exports.profile = catchAsync(
    async (req, res) => {
      
        res.status(200).json({
            status:'success',
            message: 'file uploaded successfully.',
            data: req.file
        });
    });