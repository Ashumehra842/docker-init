const AppError = require('./../utils/appError');

/* this function is for production where minimum error showing invalid Id error*/
const handleCastErrorDB = err => {

	const message = `Invalid ${err.path}: ${err.value._id}.`;

	return new AppError(message, 400);
};
/* this function is for production where minimum error showing for duplicate value error*/
const handleduplicateFieldsDB = err => {
	const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
	const message = `Duplicate field value: ${value} Please use another value!`;
	return new AppError(message, 400);
};


const sendErrorDev = (err, res) => {
	return res.status(err.statusCode).json({
		status: err.status,
		error: err,
		message: err.message,
		stack: err.stack
	});
}

const sendErrorProd = (err, res) => {
	// This is for developer tho show the proper error message.
	if (err.isOperational) {
		return res.status(err.statusCode).json({
			status: err.status,
			message: err.message,

		});
	} else {
		// This for client to dont show the error to client screen.
		return res.status(500).json({
			status: 'error',
			message: 'Something went wrong...',

		});
	}

}


module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';
	err.message = err.message;

	if (process.env.NODE_ENV === 'production') {

		let error = err;
		console.log(error.name);
		if (error.name === 'CastError') error = handleCastErrorDB(error);
		if (error.code === 11000) error = handleduplicateFieldsDB(error);
		sendErrorProd(error, res);
	} else if (process.env.NODE_ENV === 'development') {
		sendErrorDev(err, res);
	}



};
