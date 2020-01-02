require('dotenv').config();
var Admin = require('../myDatabase/admin');
var bcrypt = require('bcrypt');
var bodyParser = require("body-parser");
var flash = require("connect-flash");
const MongoClient = require('mongodb').MongoClient;
var uri = process.env.DB_LOCALHOST || process.env.DB_ATLAS;
const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });

function admin(username,password){
  this.username=username;
  this.password=password;
}

exports.addAdmin= async function(req,res,next){
  var username=req.body.username;
  console.log(username);
  var password=req.body.password;
  console.log(password);
  var password_2=req.body.password_2;
  console.log(password_2);
  var salt=bcrypt.genSaltSync(10);
  if (password !== password_2){
    res.render('register', { title: 'Register', message: 'Please input right password !!!' });
  }
  else{
    console.log("check");
    client.connect(err => {
      const collection = client.db("guest").collection("admin");
      collection.findOne({username:username},function(err,obj){
        if (!obj){
          var new_admin= new admin(username,bcrypt.hashSync(password,salt));
          console.log('check');
          collection.insertOne(new_admin,function(err){
            if (err) throw err;
            console.log("insert new admin successfully !!!");
          });
          client.close();
          res.render('register', { title: 'Register', message: 'Create new admin successfully !!!' });
        }
        else{
          res.render('register', { title: 'Register', message: 'Username already exist !!!' });
        }
      })
    });
  }
}