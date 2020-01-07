require('dotenv').config();

var products = require('../myDatabase/products');
var products =require('../myDatabase/users');
var passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const MongoClient = require('mongodb').MongoClient;
var uri = process.env.DB_LOCALHOST || process.env.DB_ATLAS; 
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

exports.indexPage= async function(req,res,next){
    if (req.isAuthenticated()){
        res.render('index',{title:'AEMÌNHDUI', layout:'loggedLayout'})
    }
    else{
        res.render('index',{title:'AEMÌNHDUI', layout:'layout'})
    }
}
exports.productsPage= async function(req,res,next){
    if (req.isAuthenticated()){
        res.render('products',{title:'AEMÌNHDUI-Products', layout:'loggedLayout'})
    }
    else{
        res.render('products',{title:'AEMÌNHDUI-Products', layout:'layout'})
    }
}

exports.detailPage= async function(req,res,next){
    if (req.isAuthenticated()){
        res.render('detail',{title:'AEMÌNHDUI-Detail', layout:'loggedLayout'})
    }
    else{
        res.render('detail',{title:'AEMÌNHDUI-Detail', layout:'layout'})
    }
}

exports.sortPage= async function(req,res,next){
    if (req.isAuthenticated()){
        res.render('Sort',{title:'Sort', layout:'loggedLayout'})
    }
    else{
        res.render('Sort',{title:'Sort', layout:'layout'})
    }
}