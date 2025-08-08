/**
 * Class:Error Handler
 * etends Error class and hadle all routes error also handle catch block errors
 * 
 */
class appError extends Error{

    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode;
        this.sttaus = `${statusCode}`.startsWith('4')? 'failed': 'error';
        this.isOperational =  true;
        Error.captureStackTrace(this. this.constructor);
    }
}
module.exports = appError;