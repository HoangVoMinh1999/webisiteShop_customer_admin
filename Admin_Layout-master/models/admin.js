require('dotenv').config();

var mongoose=require('mongoose');
var express=require('express');
var router = express.Router();
const assert = require('assert');
const mongodb=require('mongodb');
const MongoClient = require('mongodb').MongoClient;
var uri = process.env.DB_LOCALHOST || process.env.DB_ATLAS;
const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });


//--- create Collection
client.connect(err => {
    const db = client.db("guest");
    console.log("Connected ADMIN !!!")
    const collection = client.db("guest").createCollection("admin",function(err,res){
        if (err) throw err;
        console.log("create database ADMIN successfully !!!");
    });
    client.close();
});
module.exports= router;