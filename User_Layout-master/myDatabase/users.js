require('dotenv').config();

var mongoose=require('mongoose');
var products=require('../models/users');
var express = require('express');
var router = express.Router();
var mongodb=require('mongodb');
var bcrypt=require('bcrypt');

const MongoClient = require('mongodb').MongoClient;
var uri = process.env.DB_LOCALHOST || process.env.DB_ATLAS;
const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });

///---Database
var schema=mongoose.Schema;

var userSchema=new schema({
    name:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        required:true,
        min:6,
    },
    password:{
        type:String,
        required:true,
        min:6,
    },
})

module.exports= mongoose.model('users',userSchema,'users');
function user(name,username,password){
    this.name=name;
    this.username=username;
    this.password=password;
}

