const express = require("express");
const app = express();

// middleware 
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

Grid = mongoose.Grid;

mongoose.connect("mongodb://localhost:27017/node-demo", {useNewUrlParser: true }, function (err, db) {
    if (err) return console.dir(err);

	// let grid = new Grid(db, 'fs');
	// let buffer = new Buffer("Hello world");
	// grid.put(buffer, {metadata: {category: 'text'}, content_type: 'text'}, function (err, fileInfo) {
    //     grid.get(fileInfo._id, function (err, data) {
    //         console.log("Retrieved data: " + data.toString());
    //         grid.delete(fileInfo._id, function (err, result) {
    //         });
    //     });
    // });
});


const nameSchema = new mongoose.Schema({
    firstName: String,
    lastNameName: String
});

const User = mongoose.model("User", nameSchema);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});
// node app.js

app.post("/addname", (req, res) => {
	let myData = new User(req.body);
    myData.save()
        .then(item => {
            res.send("item saved to database");
        })
        .catch(err => {
            res.status(400).send("unable to save to database");
        });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});