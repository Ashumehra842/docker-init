const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    name:{type:String, required:[true, 'Name is required']},
    email:{type:String, required:[true, 'Email is required'], unique:true},
    password:{type:String, required:[true, 'Password is required']}
});

const dashboardModel = mongoose.model('Practices', schema);

module.exports = dashboardModel;