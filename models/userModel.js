var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var userModel = new Schema({
    username: String,
    password: String
});

userModel.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userModel);
