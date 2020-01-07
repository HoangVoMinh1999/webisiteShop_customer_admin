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
var layoutController = require('../controller/layoutController');
var passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var session = require('express-session')
var flash = require("connect-flash");
var bcrypt=require('bcrypt');

const MongoClient = require('mongodb').MongoClient;
var uri = process.env.DB_LOCALHOST || process.env.DB_ATLAS;

console.log(uri);
/* GET home page. */
router.get('/', layoutController.indexPage);
//---Products---
//------------------------------------------------
router.get('/products', productsController.filter);
//------------------------------------------------
router.get('/sort',productsController.sortProduct);
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
router.post('/login',loginController.userLogin);
//-------------------------------------------------
router.get('/logout', logoutController.logout);
module.exports = router;
