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
        type:String
    },
    id:{
        type:Number,
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
    }
});

///---Database of Shirt

function data(imagePath,id,name,brand,type,price){
    this.imagePath=imagePath;
    this.id=id;
    this.name=name;
    this.brand=brand;
    this.type=type;
    this.price=price;
}
module.exports= mongoose.model('products',productsSchema,'products');
var data_products=[
    new data(
        "https://www.viettien.com.vn/admin/wp-content/uploads/2018/11/3a-1.jpg",
        0,
        "viettien_01",
        "Việt Tiến",
        "Shirt",
        1000000
    ),
    new data(
        "https://www.viettien.com.vn/admin/wp-content/uploads/2018/11/3a-1.jpg",
        0,
        "viettien_02",
        "Việt Tiến",
        "Shirt",
        500000
    ),
    new data(
        "https://www.viettien.com.vn/admin/wp-content/uploads/2018/11/3a-1.jpg",
        0,
        "viettien_03",
        "Việt Tiến",
        "Shirt",
        45678
    ),
    new data(
        "https://assets.adidas.com/images/w_600,f_auto,q_auto:sensitive,fl_lossy/d285610e30664900b857a7fa00ed0201_9366/Superstar_Shoes_White_C77124_01_standard.jpg",
        0,
        "Adidas_01",
        "Adidas",
        "Shoes",
        1000000
    ),
    new data(
        "https://assets.adidas.com/images/w_600,f_auto,q_auto:sensitive,fl_lossy/d285610e30664900b857a7fa00ed0201_9366/Superstar_Shoes_White_C77124_01_standard.jpg",
        0,
        "Adidas_02",
        "Adidas",
        "Shoes",
        500000
    ),   
    new data(
        "https://c.static-nike.com/a/images/t_PDP_1280_v1/f_auto/gorfwjchoasrrzr1fggt/air-max-270-shoe-nnTrqDGR.jpg",
        0,
        "Nike_03",
        "Nike",
        "Shoes",
        345678
    ),
    new data(
        "https://s7d5.scene7.com/is/image/UrbanOutfitters/52145463_106_f?$xlarge$&hei=900&qlt=80&fit=constrain",
        0,
        "Levis_011",
        "Levis",
        "Trousers",
        1000000
    ),
    new data(
        "https://s7d5.scene7.com/is/image/UrbanOutfitters/52145463_106_f?$xlarge$&hei=900&qlt=80&fit=constrain",
        0,
        "Levis_012",
        "Levis",
        "Trousers",
        500000
    ),
    new data(
        "https://s7d5.scene7.com/is/image/UrbanOutfitters/52145463_106_f?$xlarge$&hei=900&qlt=80&fit=constrain",
        0,
        "Levis_013",
        "Levis",
        "Trousers",
        345678
    ),
       
];
//--- insert Data
client.connect(err => {
    const collection = client.db("guest").collection("products");
    for (i=1;i<data_products.length;i++)
    {
        data_products[i].id=i;
        collection.insertOne(data_products[i],function(err,res){
            if (err) throw err;
            console.log("Insert data successfully !!!");
        });
    }

    client.close();
  });
module.exports= router;