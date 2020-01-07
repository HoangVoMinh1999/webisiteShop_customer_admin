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
var new_product = [
    {
        imagePath:"https://s7d5.scene7.com/is/image/UrbanOutfitters/52145463_106_f?$xlarg...",
        name:"Levis_013",
        brand :"Levis",
        type:"Trousers",
        price:345678,
        status: true,
        quantity: 50,
        quality: 5,
    },
    {
        imagePath:"https://www.viettien.com.vn/admin/wp-content/uploads/2018/11/3a-1.jpg",
        name:"viettien_03",
        brand :"Việt Tiến",
        type:"Shirt",
        price:500000,
        status: true,
        quantity: 100,
        quality: 4,
    },
    {
        imagePath:"https://assets.adidas.com/images/w_600,f_auto,q_auto:sensitive,fl_loss...",
        name:"Adidas_03",
        brand :"Adidas",
        type:"Shoes",
        price:1000000,
        status: true,
        quantity: 40,
        quality: 3.5,
    },
]

client.connect(err => {
    const collection = client.db("guest").collection("products");
    collection.insertMany(new_product, function (err) {
        if (err) throw err;
        console.log("Insert PRODUCT successfully !!!");
    })
    client.close();
});

module.exports= router;