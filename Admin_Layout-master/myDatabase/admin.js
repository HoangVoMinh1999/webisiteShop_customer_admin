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
    avatar:{
        type:String,
    },
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true,
    },
    address:{
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

module.exports= mongoose.model('admin',adminSchema,'admin');
var salt=bcrypt.genSaltSync(10);
var superadmin={
    avatar:"https://scontent-sin6-2.xx.fbcdn.net/v/t1.0-9/s960x960/44262487_2183162718622462_1307505623927095296_o.jpg?_nc_cat=101&_nc_oc=AQnGVqV5Khh_RwHzHt-LPrJBO5vgwNYIBRVRk092gWb1lGiDh4nO9s-_Z2AGwmKjGbs&_nc_ht=scontent-sin6-2.xx&oh=f3f488a6f60c78570d3a8830e7a521f9&oe=5EB016EF",
    name:"Trịnh Vũ Hoàng",
    email:"vdtrinh@gmail.com",
    phone:"0987654321",
    address:'TP.HCM',
    username:"superadmin",
    password:bcrypt.hashSync("123456",salt),
}
client.connect(err => {
    const collection = client.db("guest").collection("admin");
    collection.insertOne(superadmin,function(err){
        if (err) throw err;
        console.log("Insert ADMIN successfully !!!");
    })
    client.close();
  });
  module.exports= router;