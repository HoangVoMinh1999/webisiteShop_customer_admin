var passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var session = require('express-session')
var flash = require("connect-flash");

exports.logout = (req,res,next) => {
    // delete session in server
    req.session.destroy();
    res.redirect('/')
}
passport.deserializeUser((user, done) => done(null, user));