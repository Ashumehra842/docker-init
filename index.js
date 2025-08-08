const express = require('express');
const app  = express();
const router = require('./routes/web');
const dotenv =  require('dotenv').config();
const bodyParser = require('body-parser');
const appError =  require('./utils/appError');
const mongoose = require('mongoose');
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

app.all("*",(req, res, next) =>{
	next();
});
/*Bellow is the middleware to handle the error globally */
app.use((err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
});



app.listen(port, ()=>{
	console.log(`server running on port ${port} successfully.`);
});