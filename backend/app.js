
var express = require("express");
var app = express();
var port = 3000;

// middleware 
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var mongoose = require("mongoose");
mongoose.Promise = global.Promise;

Grid = mongo.Grid;

// mongoose.connect("mongodb://localhost:27017/node-demo");
// mongoose.connect("mongodb://localhost:27017/node-demo", { useNewUrlParser: true });

mongoose.connect("mongodb://localhost:27017/node-demo", function(err, db) {
	if(err) return console.dir(err);

	var grid = new Grid(db, 'fs');
	var buffer = new Buffer("Hello world");
	grid.put.(buffer, {metadata:{category:'text'}, content_type: 'text'}, function(err, fileInfo) {
		grid.get(fileInfo._id, function(err, data) {
			console.log("Retrieved data: " + data.toString());
			grid.delete(fileInfo._id, function(err, result) {
			});
		});
	});
});


var nameSchema = new mongoose.Schema({
	firstName: String,
	lastNameName: String
});

var User = mongoose.model("User", nameSchema);

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});
// node app.js

app.post("/addname", (req, res) => {
	var myData = new User(req.body);
	myData.save()
	.then(item => {
		res.send("item saved to database");
	})
	.catch(err => {
		res.status(400).send("unable to save to database");
	});
});

app.listen(port, () => {
	console.log("Server listening on port " + port);
});