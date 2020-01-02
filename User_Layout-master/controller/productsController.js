require('dotenv').config();

var products = require('../myDatabase/products');

const MongoClient = require('mongodb').MongoClient;
var uri = process.env.DB_LOCALHOST || process.env.DB_ATLAS;

exports.showProducts = async function (req, res, next) {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  client.connect(err => {
    var data = [];
    const collection = client.db("guest").collection("products");
    let query = {};
    var cursor = collection.find(query);
    cursor.forEach(function (item, err) {
      if (err) throw err;
      data.push(item);
    }, function () {
      client.close();
      res.render('products', {title: 'Products', products: data});
    });
  });
};
//------------------------------------------------------
exports.filter= async function(req,res,next){
  var data=[];
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  client.connect(err => {
    const collection = client.db("guest").collection("products");
    let query={
      type : req.query.type,
      brand : req.query.brand,
    };
    var cursor=collection.find(query);
    cursor.forEach(function(item,err){
      if (err) throw err;
      data.push(item);
    },function(){
      client.close();
      res.render('products',{title : 'Products',products:data});
    });
  });
};
//------------------------------------------
exports.detail = async function (req, res, next) {
  var data = [];
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  client.connect(err => {
    const collection = client.db("guest").collection("products");
    let query = {
      _id: require('mongoose').Types.ObjectId(req.query._id),
    };
    var cursor = collection.find(query);
    cursor.forEach(function (item, err) {
      if (err) throw err;
      data.push(item);
      console.log(data);
    }, function () {
      client.close();
      res.render('product_detail', { title: 'Detail', products: data });
    });
  });
};