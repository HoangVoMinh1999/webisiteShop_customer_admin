require('dotenv').config();

var products = require('../myDatabase/products');

const MongoClient = require('mongodb').MongoClient;
var uri = process.env.DB_LOCALHOST || process.env.DB_ATLAS;
//------------------------------------------------------
exports.filter = async function (req, res, next) {
	var data=[]
	var limit=9
	var listPage=[]
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
	client.connect(err => {
		const collection = client.db("guest").collection("products");
		let query=req.query;
		console.log(query);
		var cursor=collection.find(query)
		cursor.forEach(function(item,err){
			if (err) throw err;
			if (item.status==true){
				data.push(item)
			}
		},function(){
			var totalProduct=data.length
			console.log(totalProduct);
			var totalPage=totalProduct/limit;
			for (i=0;i<totalProduct;i++){
				listPage.push(i)
			}
			client.close();
			res.render('products',{title:'Products',products:data,page:listPage})
		})
	  });
};
//------------------------------------------
exports.sortProduct = async function (req, res, next) {
	var data = [];
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
	client.connect(err => {
		const collection = client.db("guest").collection("products");
		let query = req.body.name;
		console.log(query);
		collection.find().sort(query, function (err, item) {
			if (err) throw err;
			data.push(item);
			console.log(data);
		});
		client.close();
		res.render('products', { title: 'Sort', products: data });
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