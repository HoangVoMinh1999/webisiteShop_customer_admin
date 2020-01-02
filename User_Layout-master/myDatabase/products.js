require('dotenv').config();

var mongoose=require('mongoose');
var products=require('../models/products');
var express = require('express');
var router = express.Router();
var mongodb=require('mongodb');

const MongoClient = require('mongodb').MongoClient;
var uri = process.env.DB_LOCALHOST || process.env.DB_ATLAS;
const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });

///---Database of Shirt

function data(imagePath,id,name,brand,type,price){
    this.imagePath=imagePath;
    this.id=id;
    this.name=name;
    this.brand=brand;
    this.type=type;
    this.price=price;
}




module.exports= router;