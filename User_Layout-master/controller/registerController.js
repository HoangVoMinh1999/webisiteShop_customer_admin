var User = require('../myDatabase/users');
var express = require("express");
var bodyParser = require("body-parser");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//Set up mongoose connection
const MongoClient = require('mongodb').MongoClient;
var uri = process.env.DB_LOCALHOST || process.env.DB_ATLAS;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

exports.register = (req, res, next) => {
    res.render('register', { title: 'Register', layout: 'loginLayout' });
}

exports.postRegister = (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;
    let name = req.body.name;
    let password_2=req.body.password_2;
    let salt = bcrypt.genSaltSync(10);
    let user = User.findOne({ username: req.body.username },
        function (err, obj) {
            //console.log(obj);
            if (obj !== null) {
                res.render('register', { title: 'Register',layout: 'loginLayout', message: 'username already exist' });
            } else {
                if (password !== password_2){
                    res.render('register', { title: 'Register',layout:'loginLayout', message: 'Wrong password !!!' });
                }
                else{
                    var salt=bcrypt.genSaltSync(10);
                    user = new User({
                        name: name,
                        username: username,
                        password: bcrypt.hashSync(password,salt),
                    });
                    console.log(user);
                    client.connect(err => {
                        const collection = client.db("guest").collection("users");
                        collection.insertOne(user);
                        client.close();
                    });
    
                    res.redirect('/login');
                }
            }
        });
}