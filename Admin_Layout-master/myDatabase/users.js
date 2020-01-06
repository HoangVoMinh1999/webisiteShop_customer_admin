require('dotenv').config();

var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var bcrypt = require('bcrypt');
var products = require('../models/users');

const MongoClient = require('mongodb').MongoClient;
var uri = process.env.DB_LOCALHOST || process.env.DB_ATLAS;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

///---Database
var schema = mongoose.Schema;

var userSchema = new schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        min: 6,
    },
    password: {
        type: String,
        required: true,
        min: 6,
    },
    status:{
        type:Boolean,
        default:true,
    }
});

module.exports = mongoose.model('users', userSchema, 'users');

var superuser = {
    name:"Võ Minh Hoàng",
    username: "superuser",
    password: "123456",
}
client.connect(err => {
    const collection = client.db("guest").collection("users");
    collection.insertOne(superuser, function (err) {
        if (err) throw err;
        console.log("Insert USER successfully !!!");
    })
    client.close();
});
module.exports=router;