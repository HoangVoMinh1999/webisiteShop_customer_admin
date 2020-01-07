require('dotenv').config();

var users = require('../myDatabase/users');
var passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var session = require('express-session')
var flash = require("connect-flash");
var bcrypt=require('bcrypt');
const MongoClient = require('mongodb').MongoClient;
var uri = process.env.DB_LOCALHOST || process.env.DB_ATLAS;

var ssn;
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
				if (!bcrypt.compareSync(passwordField,user.password)) {
					return done(null, false, req.flash('message', 'Incorrect password.'));
				}
				if (user.status==false)
				{
					return done(null, false, req.flash('message', 'User Deacted.'));
				}
				var sessData = req.session;
				sessData.userSession = user;
				ssn=user;
				return done(null, user);
			});
			client.close();
		});
	}
));
passport.serializeUser((user, done) => done(null, user));


exports.detail=async function(req,res,next){
	var data=[];
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
	client.connect(err => {
		let query={
			_id:require('mongoose').Types.ObjectId(ssn._id)
		}
		console.log(query)
		const collection = client.db("guest").collection("users");
		var cursor=collection.find(query)
		cursor.forEach(function(item,err){
			if (err) throw err;
			data.push(item);
			console.log(data);
		})
		client.close();
		res.render('account',{title:'Profile',layout:'loggedLayout',user:data});
	  });
}
exports.confirmChange=async function(req,res,next){
	
}

