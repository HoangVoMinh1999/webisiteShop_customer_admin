require('dotenv').config();

var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var products = require('../myDatabase/products');
var users = require('../myDatabase/users');
var productsController = require('../controller/productsController');
var registerController = require('../controller/registerController');
var loginController = require('../controller/loginController');
var logoutController = require('../controller/logoutController');
var passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var session = require('express-session')
var flash = require("connect-flash");
var bcrypt=require('bcrypt');

const MongoClient = require('mongodb').MongoClient;
var uri = process.env.DB_LOCALHOST || process.env.DB_ATLAS;

console.log(uri);
/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index', { title: 'AEMÌNHDUI' });
});
//---Products---
//------------------------------------------------
router.get('/products', productsController.showProducts);
//------------------------------------------------
router.get('/filter', productsController.filter);
//--------------------------------------------------
router.get('/detail', productsController.detail);

//---Users---
//-----Register
router.get('/register', registerController.register);
//-------------------------------------------------
router.post('/register', registerController.postRegister);
//--------------------------------------------------

//-----Login
router.get('/login', loginController.login);
//--------------------------------------------------
router.post('/login',passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/login',
	failureFlash: true
}),
function (req, res) {
	// set session

	res.redirect('/',{message: req.flash('message')});
});
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

				var sessData = req.session;
				sessData.userSession = user;

				return done(null, user);
			});
			client.close();
		});
	}
));
//-------------------------------------------------
router.get('/logout', logoutController.logout);
module.exports = router;
