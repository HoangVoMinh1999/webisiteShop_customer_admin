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
router.get('/index',adminController.checkLogin,function(req,res,next){
	res.render('index', { title: 'Index' })
})
//------------------------------------------------------------------------------------------
//---Admin----------------------------------------------------------------------------------
//---Login
router.get('/', function (req, res, next) {
	res.render('login', { title: 'Login', message: req.flash('message'), layout:'loginLayout' });
});
router.post('/', adminController.login)
//---Register
router.get('/register',function(req,res,next){
	res.render('register',{title:'Register'});
});
router.post('/register',adminController.addAdmin);
//---My Profile
router.get('/my_profile',adminController.viewProfile);
//---Log out
router.get('/logout',adminController.logout);
//-------------------------------------------------------------------------------------------
//---Users
router.get('/customer', userController.searchUser);
//---Activate User
router.get('/view_user',userController.detailUserPage);
router.post('/view_user',userController.detailUser);
//-------------------------------------------------------------------------------------------
//---Products--------------------------------------------------------------------------------
router.get('/products', productsController.showProducts);
//---Add Product
router.get('/add_product',function(req,res,next){
	res.render('add_product',{title:'Add new product'});
});
router.post('/add_product',productsController.addProduct);
//---Change Info Product
router.get('/change_info_product',productsController.changeInfoPage);
router.post('/change_info_product',productsController.changeInfo);
//---Delete Product
router.get('/del_product',productsController.deleteProductPage);
router.post('/del_product',productsController.deleteProduct);

module.exports = router;
