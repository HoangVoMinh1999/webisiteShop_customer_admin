require('dotenv').config();

var mongoose=require('mongoose');
var express = require('express');
var router = express.Router();
var mongodb=require('mongodb');
var products=require('../models/products');

const MongoClient = require('mongodb').MongoClient;
var uri = process.env.DB_LOCALHOST || process.env.DB_ATLAS;
const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });

var schema=mongoose.Schema;

var productsSchema=new schema({
    imagePath:{
        type:String,
        required:true,
        default:'https://carolinadojo.com/wp-content/uploads/2017/04/default-image.jpg',
    },
    name:{
        type:String,
    },
    brand:{
        type:String,
    },
    type:{
        type:String,
    },
    price:{
        type:Number,
    },
    status:{
        type:Boolean,
        default:true,
    },
    quantity:{
        type:Number,
        default:0,
    },
    quality:{
        type:Number,
        max:5,
        min:0,
    }
});
module.exports= mongoose.model('products',productsSchema,'products');




module.exports= router;