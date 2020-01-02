require('dotenv').config();

var express = require('express');
var router = express.Router();
var passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var session = require('express-session')
var flash = require("connect-flash");
var bcrypt = require('bcrypt');
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var products = require('../myDatabase/products');
var users = require('../myDatabase/users');
var admin = require('../myDatabase/admin');
var productsController = require('../controller/productsController');
var userController = require('../controller/userController');
var adminController=require('../controller/adminController');
const MongoClient = require('mongodb').MongoClient;
var uri = process.env.DB_LOCALHOST || process.env.DB_ATLAS;
/* GET home page. */
router.get('/index', function (req, res, next) {
	res.render('index', { title: 'Index' });
});
//--------------------------------------
//---Login
router.get('/', function (req, res, next) {
	res.render('login', { title: 'Login', message: req.flash('message'), layout:'loginLayout' });
});
router.post('/login', passport.authenticate('local', {
	successRedirect: '/index',
	failureRedirect: '/',
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
		var salt = bcrypt.genSaltSync(10);
		const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
		client.connect(err => {
			const collection = client.db("guest").collection("admin");
			collection.findOne({ username: usernameField }, function (err, user) {
				if (err) { return done(err); }
				if (!user) {
					return done(null, false, req.flash('message', 'Incorrect username.'));
				}
				console.log(passwordField);
				console.log(bcrypt.hashSync(passwordField, salt));
				console.log(user.password);
				if (!bcrypt.compareSync(passwordField, user.password)) {
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
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
//---Register
router.get('/register',function(req,res,next){
	res.render('register',{title:'Register'});
});
router.post('/register',adminController.addAdmin);
//--------------------------------------------
//---Products
router.get('/products', productsController.showProducts);
router.get('/add_product',function(req,res,next){
	res.render('add_product',{title:'Add new product'});
});
router.post('/add_product',productsController.addProduct);

router.get('/change_info',productsController.changeInfoPage);
router.post('/change_info',productsController.changeInfo);
//---Users
router.get('/customer', userController.showUsers);
module.exports = router;
