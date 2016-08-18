var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/userModel.js');

module.exports = function(passport){
    // passport config
    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
}