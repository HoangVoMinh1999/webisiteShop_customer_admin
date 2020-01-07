require('dotenv').config();

var products = require('../myDatabase/products');

const MongoClient = require('mongodb').MongoClient;

var uri = process.env.DB_LOCALHOST || process.env.DB_ATLAS;

//------------------------------------------------------
exports.filter = async function (req, res, next) {
	var data = []
	var limit = 9
	var listPage = []
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
	client.connect(err => {
		const collection = client.db("guest").collection("products");
		let query = req.query;
		console.log(query);
		var cursor = collection.find(query,{status:true})
		cursor.forEach(function (item, err) {
			if (err) throw err;
			if (item.status == true) {
				data.push(item)
			}
		}, function () {
			console.log(data);
			client.close();
			if (req.isAuthenticated()) {
				res.render('products', { title: 'Products', layout: 'loggedLayout', products: data })
			}
			else
			res.render('products', { title: 'Products', layout: 'layout', products: data })
		})
	});
};
//------------------------------------------
//------------------------------------------
exports.sortProduct = async function (req, res, next) {
	var data = [];
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
	client.connect(err => {
		const collection = client.db("guest").collection("products");
		console.log('check')
		let query={
			name:1
		}
		if (req.query!==query) query={name:Number(req.query.name)}
		if (isNaN(query.name)) query={name:-1}
		console.log(query)
		var cursor=collection.find({status:true}).sort(query)
		cursor.forEach(function(item,err){
			if (err) throw err;
			data.push(item)
		},function(){
			client.close();
			if (req.isAuthenticated()) {
				res.render('sort', { title: 'Sort', layout: 'loggedLayout', products: data })
			}
			else
			res.render('sort', { title: 'Sort', layout: 'layout', products: data })
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
			if (req.isAuthenticated()){
				res.render('product_detail', { title: 'Detail',layout:'loggedLayout', products: data });
			}
			else{
				res.render('product_detail', { title: 'Detail', products: data });
			}
			
		});
	});
};