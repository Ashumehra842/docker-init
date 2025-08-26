const express = require('express');
const app  = express();
const router = require('./routes/web');
const dotenv =  require('dotenv').config();
const bodyParser = require('body-parser');
const AppError = require('./utils/AppError');
const ErrorHandlerController = require('./Controllers/ErrorController');
const mongoose = require('mongoose');
const status = require('statuses');
const port = process.env.PORT ||4000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/* Create DB connection */
mongoose.connect(process.env.CONNECTION_URL).then(() => {
	console.log('DB Connected successfully.');
}).catch((error)=>{
	console.log(error.message);
});
  

app.use('/v1/user',router);


/*Bellow is the middleware for route handle 
if any unknown route hit from url the it will show custom error
*/
app.all(/.*/, (req, res, next) => {
	// const err = new Error(`The Url: ${req.originalUrl} trying to access is not found.`);
	
	/*Below is optimized way to handle error*/
	next(new AppError(`The Url: ${req.originalUrl} trying to access is not found.`, 404));
});


/*Bellow is the express middleware to handle the error globally */

app.use(ErrorHandlerController);


app.listen(port, ()=>{
	console.log(`server running on port ${port} successfully.`);
});