require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs=require('express-handlebars');
var mongoose=require('mongoose');
var mongodb=require('mongodb');
var session = require("express-session");
var bodyParser = require("body-parser");
var passport=require('passport');
var flash = require("connect-flash");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

var uri = process.env.DB_LOCALHOST || process.env.DB_ATLAS;
mongoose.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.engine('hbs',hbs({extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname+'/views/layouts/'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static('public'));

app.use(session({
  secret:"secret",
  saveUninitialized:false,
  resave:false
 }));
app.use(cookieParser());  
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(flash());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});
passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
