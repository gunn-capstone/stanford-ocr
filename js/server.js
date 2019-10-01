const express = require("express");
const app = express();
const port = 3000;

// middleware
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

mongoose.connect("mongodb://localhost:27017/node-demo",
    {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true}).then(r => {}) ;


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

app.get('/data', function (req, res,html) {
    res.sendFile(__dirname+'/data.html');
});

app.get('/index', function (req, res,html) {
    res.sendFile(__dirname+'/index.html');
});

app.listen(port, () => {
    console.log("Server listening on port " + port);
});