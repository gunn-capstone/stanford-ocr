'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.dataCollection = undefined;

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _addParticipant = require('./addParticipant');

var _writeCSV = require('./writeCSV');

var _detect = require('./detect');

var _firebaseAdmin = require('firebase-admin');

var _firebaseAdmin2 = _interopRequireDefault(_firebaseAdmin);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// express for web handling
var app = (0, _express2.default)();
var dirPublic = __dirname + '/../public';
app.use(_express2.default.static(dirPublic));

// firestore for database and file storage
_firebaseAdmin2.default.initializeApp({
    credential: _firebaseAdmin2.default.credential.applicationDefault(),
    databaseURL: 'https://stanford-ocr.firebaseio.com'
});
var db = _firebaseAdmin2.default.firestore();
var dataCollection = exports.dataCollection = db.collection('dataCollection');
console.log('Firebase Initialized');

// body parser for req body parsing
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.send(dirPublic + 'index.html');
});

// add form data to database
app.post('/addParticipant', function (req, res) {
    (0, _addParticipant.addParticipant)(req.body, res);
    res.sendFile('form.html', { root: dirPublic });
});

// to write database to csv file for export; doesnt work idk why
app.get('/download', function (req, res) {
    var date_ob = new Date();
    var filepath = __dirname + '/../survey_data_' + date_ob.getFullYear() + "_" + ("0" + (date_ob.getMonth() + 1)).slice(-2) + "_" + ("0" + date_ob.getDate()).slice(-2) + "_" + date_ob.getHours() + "_" + date_ob.getMinutes() + ".txt";
    (0, _writeCSV.writeCSV)(filepath);
    res.download(filepath);
});

// test of google cloud vision; will be ported to python script by quinn and justin ig
app.get('/test', function (req, res) {
    (0, _detect.detect)().then(function (r) {});
    res.send('huh');
});

var port = process.env.port || 8080;
app.listen(port, function () {
    console.log("Server listening on port " + port);
});