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