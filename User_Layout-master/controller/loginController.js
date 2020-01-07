require('dotenv').config();

var users = require('../myDatabase/users');
var passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var session = require('express-session')
var flash = require("connect-flash");
var bcrypt=require('bcrypt');
const MongoClient = require('mongodb').MongoClient;
var uri = process.env.DB_LOCALHOST || process.env.DB_ATLAS;


exports.login = (req,res,next) => {
    res.render('login', { title: 'AEMÌNHDUI',layout:'loginLayout',message: req.flash('message')  });
}

exports.userLogin=passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/login',
	failureFlash: true
}),
function (req, res) {
	// set session

	res.redirect('/',{message: req.flash('message')});
};
passport.use(new LocalStrategy({
	passReqToCallback: true,
	usernameField: 'username',
	passwordField: 'password'
},
	function (req, usernameField, passwordField, done) {
		var salt=bcrypt.genSaltSync(10);
		const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
		client.connect(err => {
			const collection = client.db("guest").collection("users");
			collection.findOne({ username: usernameField }, function (err, user) {
				if (err) { return done(err); }
				if (!user) {
					return done(null, false, req.flash('message', 'Incorrect username.'));
				}
				console.log(passwordField);
				console.log(bcrypt.hashSync(passwordField,salt));
				console.log(user.password);
				if (!bcrypt.compareSync(passwordField,user.password)) {
					return done(null, false, req.flash('message', 'Incorrect password.'));
				}
				if (user.status==false)
				{
					return done(null, false, req.flash('message', 'User Deacted.'));
				}
				var sessData = req.session;
				sessData.userSession = user;
                console.log(sessData);
				return done(null, user);
			});
			client.close();
		});
	}
));
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

