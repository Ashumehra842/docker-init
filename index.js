const express = require('express');
const app  = express();
const router = require('./routes/web');
const dotenv =  require('dotenv').config();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const port = process.env.PORT ||4000;

/* Create DB connection */
mongoose.connect(process.env.CONNECTION_URL).then(() => {
	console.log('DB Connected successfully.');
}).catch((error)=>{
	console.log(error.message);
});
  
app.use(express.json());
app.use('/v1/user',router);


app.listen(port, ()=>{
	console.log(`server running on port ${port} successfully.`);
});