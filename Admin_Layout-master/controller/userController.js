require('dotenv').config();
var products=require('../myDatabase/users');
const MongoClient = require('mongodb').MongoClient;
var uri = process.env.DB_LOCALHOST || process.env.DB_ATLAS;


exports.showUsers=function(req,res,next){
    const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });
    client.connect(err => {
      var data=[];
      const collection = client.db("guest").collection("users");
      let query={};
      var cursor=collection.find(query);
      cursor.forEach(function(item,err){
        if (err) throw err;
        data.push(item);
      },function(){
        client.close();
        res.render('customer',{title:'Customers',users:data});
      });
    });
}

exports.searchUser=function(req,res,next){
  const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });
  client.connect(err => {
    var data=[];
    var choice=req.query.choice;
    var value=req.query.value;
    const collection = client.db("guest").collection("users");
    let query={};
    var cursor=collection.find(query);
    cursor.forEach(function(item,err){
      if (err) throw err;
      data.push(item);
    },function(){
      client.close();
      res.render('customer',{title:'Customers',users:data});
    });
  });
}

exports.detailUserPage=async function(req,res,next){
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  client.connect(err => {
    var data = [];
    const collection = client.db("guest").collection("users");
    let query = {
      _id: require('mongoose').Types.ObjectId(req.query._id),
    }
    console.log(query);
    var cursor = collection.findOne(query, function (err, item) {
      if (err) throw err;
      data.push(item);
      console.log("find USER successfully !!!");
      console.log(data);
    });
    client.close();
    res.render('change_info', { title: 'Change Infomation', user: data });
  });
}

exports.detailUser=async function(req,res,next){
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  client.connect(err => {
    const collection = client.db("guest").collection("users");
    console.log("check");
    console.log(req.body.check)
    if (req.body.check==='false'){
      var temp=false;
    }
    else
    {
      var temp=true;
    }
    console.log(temp);
    let query = {
      _id: require('mongoose').Types.ObjectId(req.body._id),
    };
    console.log('check');
    console.log(query);
    let new_data = {
      $set: {
        status:temp,
      }
    }
    console.log(new_data)
    collection.updateOne(query, new_data, function (err) {
      if (err) throw err;
      console.log('Update USER successfully !!!');
    });
    client.close();
    res.redirect('/customer')
  });
}