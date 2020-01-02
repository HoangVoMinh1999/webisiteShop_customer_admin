require('dotenv').config();

var products=require('../myDatabase/products');
const MongoClient = require('mongodb').MongoClient;
var uri = process.env.DB_LOCALHOST || process.env.DB_ATLAS;

function data(imagePath,id,name,brand,type,price){
  this.imagePath=imagePath;
  this.id=id;
  this.name=name;
  this.brand=brand;
  this.type=type;
  this.price=price;
}

exports.showProducts=async function(req,res,next){
    const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });
    client.connect(err => {
      var data=[];
      const collection = client.db("guest").collection("products");
      let query={};
      var cursor=collection.find(query);
      cursor.forEach(function(item,err){
        if (err) throw err;
        data.push(item);
      },function(){
        client.close();
        res.render('product',{title:'Products',products:data});
      });
    });
};

exports.addProduct=async function(req,res,next){
  const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });
  client.connect(err => {
    const collection = client.db("guest").collection("products");
    var product=new data(
      id=collection.countDocuments()+1,
      name=req.body.name,
      imagePath=req.body.imagePath,
      brand=req.body.brand,
      type=req.body.type,
      price=req.body.price,
    );
    collection.insertOne(product, function(err){
      if (err) throw err
      console.log("Insert new product successfully !!!");
    });
    client.close();
    res.render('add_product',{title:'Add new product'});
  });
}

exports.changeInfoPage=async function(req,res,next){
  var data=[];
  const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });
  client.connect(err => {
    const collection = client.db("guest").collection("products");
    let query={
      _id: require('mongoose').Types.ObjectId(req.query._id),
    }
    var cursor=collection.findOne(query,function(err,item){
      if (err) throw err;
      data.push(item);
      console.log("find item successfully !!!");
    });
    client.close();
    res.render('change_info_product',{title:'Change Infomation',products:data});
  });
}

exports.changeInfo= async function(req,res,next){
  const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });
  client.connect(err => {
    const collection = client.db("guest").collection("products");
    let query={
      _id: require('mongoose').Types.ObjectId(req.query._id),
    }
    let new_data={ $set:{
      name:req.body.name,
      type:req.body.type,
      brand:req.body.brand,
      price:req.body.price,
    }}
    collection.updateOne(query,new_data,function(err){
      if (err) throw err;
      console.log('Update successfully !!!');
    });
    client.close();
    res.redirect('/products')
  });
}

exports.deleteProduct=async function(req,res,next){
  const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });
  client.connect(err => {
    const collection = client.db("guest").collection("products");
    var product=new data(
      id=collection.countDocuments()+1,
      name=req.body.name,
      imagePath=req.body.imagePath,
      brand=req.body.brand,
      type=req.body.type,
      price=req.body.price,
    );
    collection.insertOne(product, function(err){
      if (err) throw err
      console.log("Insert new product successfully !!!");
    });
    client.close();
    res.render('add_product',{title:'Add new product'});
  });
}