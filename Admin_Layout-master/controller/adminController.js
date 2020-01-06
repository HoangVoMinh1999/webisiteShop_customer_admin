require('dotenv').config();
var admin = require('../myDatabase/admin');
var bcrypt = require('bcrypt');
var bodyParser = require("body-parser");
var passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var session = require('express-session')
var flash = require("connect-flash");
const MongoClient = require('mongodb').MongoClient;
var uri = process.env.DB_LOCALHOST || process.env.DB_ATLAS;
const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });

module.exports.checkLogin= function(req,res,next){
  if (req.isAuthenticated()){
    return next();
  }
  else{
    res.redirect('/');
  }
}

exports.addAdmin= async function(req,res,next){
  var username=req.body.username;
  console.log(username);
  var password=req.body.password;
  console.log(password);
  var password_2=req.body.password_2;
  console.log(password_2);
  var salt=bcrypt.genSaltSync(10);
  if (password !== password_2){
    res.render('register', { title: 'Register', message: 'Please input right password !!!' });
  }
  else{
    console.log("check");
    client.connect(err => {
      const collection = client.db("guest").collection("admin");
      collection.findOne({username:username},function(err,obj){
        if (!obj){
          var new_admin= {
            username:username,
            password:bcrypt.hashSync(password,salt)};
          console.log('check');
          collection.insertOne(new_admin,function(err){
            if (err) throw err;
            console.log("insert new admin successfully !!!");
          });
          client.close();
          res.render('register', { title: 'Register', message: 'Create new admin successfully !!!' });
        }
        else{
          res.render('register', { title: 'Register', message: 'Username already exist !!!' });
        }
      })
    });
  }
}
exports.login=passport.authenticate('local', {
    successRedirect: '/index',
    failureRedirect: '/',
    failureFlash: true
  }),
    function (req, res) {
      // set session
  
      res.redirect('/',{message: req.flash('message')});
    }

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
					return done(null, false, req.flash('message', 'Wrong username or password !!!'));
				}
				console.log(passwordField);
				console.log(bcrypt.hashSync(passwordField, salt));
				console.log(user.password);
				if (!bcrypt.compareSync(passwordField, user.password)) {
					return done(null, false, req.flash('message', 'Wrong username or password !!!'));
				}

        var sessData = req.session;
				sessData.userSession = user;
				console.log(sessData)
				return done(null, user);
			});
			client.close();
		});
	}
));
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

exports.viewProfile=async function(req,res,next){
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  client.connect(err => {
    const collection = client.db("guest").collection("admin");
    var data=[]
    let query={
      // _id: require('mongoose').Types.ObjectId(req.query._id),
    }
    collection.findOne(query,function(err,item){
      if (err) throw err;
      data.push(item);
    })
    client.close();
    res.render('profile_Admin',{title:'Profile',admin:data})
  });
}

exports.logout=async function(req,res,next){
  req.session.destroy();
  console.log(session);
  res.redirect('/');
}