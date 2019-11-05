'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.dataCollection = undefined;

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _add_participant = require('./add_participant');

var _write_csv = require('./write_csv');

var _detect = require('./detect');

var _firebaseAdmin = require('firebase-admin');

var _firebaseAdmin2 = _interopRequireDefault(_firebaseAdmin);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var dirPublic = __dirname + '/../public';
app.use(_express2.default.static(dirPublic));

_firebaseAdmin2.default.initializeApp({
    credential: _firebaseAdmin2.default.credential.applicationDefault(),
    databaseURL: 'https://stanford-ocr.firebaseio.com'
});
var db = _firebaseAdmin2.default.firestore();
var dataCollection = exports.dataCollection = db.collection('dataCollection');
console.log('Firebase Initialized');

app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.send(dirPublic + 'index.html');
});

app.post('/add_participant', function (req, res) {
    (0, _add_participant.add_participant)(req.body);
    res.sendFile('form.html', { root: dirPublic });
});

app.get('/download', function (req, res) {
    // i dunno why this doesnt work
    var date_ob = new Date();
    var filepath = __dirname + '/../survey_data_' + date_ob.getFullYear() + "_" + ("0" + (date_ob.getMonth() + 1)).slice(-2) + "_" + ("0" + date_ob.getDate()).slice(-2) + "_" + date_ob.getHours() + "_" + date_ob.getMinutes() + ".txt";
    (0, _write_csv.writeCSV)(filepath);
    res.download(filepath);
});

app.get('/test', function (req, res) {
    // huh why this no work
    (0, _detect.detect)().then(function (r) {});
    res.send('huh');
});

var port = process.env.port || 8080;
app.listen(port, function () {
    console.log("Server listening on port " + port);
});