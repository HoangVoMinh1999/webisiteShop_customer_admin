require('dotenv').config();

var mongoose=require('mongoose');
var products=require('../models/admin');
var express = require('express');
var router = express.Router();
var mongodb=require('mongodb');
var bcrypt=require('bcrypt');

const MongoClient = require('mongodb').MongoClient;
var uri = process.env.DB_LOCALHOST || process.env.DB_ATLAS;
const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });

///---Database
var schema=mongoose.Schema;

var adminSchema=new schema({
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

module.exports= mongoose.model('admin',adminSchema,'admin');
function admin(username,password){
    this.username=username;
    this.password=password;
}
var admin=new admin(
    'superadmin',
    '123456',
);
client.connect(err => {
    const collection = client.db("guest").collection("admin");
    var salt=bcrypt.genSaltSync(10);
    admin.password=bcrypt.hashSync(admin.password,salt);
    collection.insertOne(admin,function(err)
    {
        if (err) throw err;
        console.log("insert admin successfully !!!!");
    });
    client.close();
  });
  module.exports= router;