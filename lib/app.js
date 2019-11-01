'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.dataCollection = undefined;

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _add_participant = require('./add_participant');

var _writeCSV = require('./writeCSV');

var _detect = require('./detect');

var _firebaseAdmin = require('firebase-admin');

var _firebaseAdmin2 = _interopRequireDefault(_firebaseAdmin);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _uploadFile = require('./uploadFile');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var dirPublic = __dirname + '/../public';
app.use(_express2.default.static(dirPublic));

_firebaseAdmin2.default.initializeApp({ // initialize firestore database
    credential: _firebaseAdmin2.default.credential.applicationDefault(),
    databaseURL: 'https://stanford-ocr.firebaseio.com'
});
var db = _firebaseAdmin2.default.firestore();
var dataCollection = exports.dataCollection = db.collection('dataCollection');

app.use(_bodyParser2.default.json()); // middleware to parse req body into json
app.use(_bodyParser2.default.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.send(dirPublic + 'index.html');
});

var multer = (0, _multer2.default)({
    storage: _multer2.default.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // no larger than 5mb, can be changed
    }
});

app.post('/upload', multer.single('file'), function (req, res) {
    console.log('Upload Image');

    var file = req.file;
    if (file) {
        (0, _uploadFile.uploadImageToStorage)(file).then(function (success) {
            res.status(200).send({
                status: 'success'
            });
        }).catch(function (error) {
            console.error(error);
        });
    }
});

app.post('/add_participant', function (req, res) {
    (0, _add_participant.add_participant)(req.body);
    res.sendFile('form.html', { root: dirPublic });
});

app.get('/download', function (req, res) {
    // i dunno why this doesnt work
    var date_ob = new Date();
    var filepath = __dirname + '/../survey_data_' + date_ob.getFullYear() + "_" + ("0" + (date_ob.getMonth() + 1)).slice(-2) + "_" + ("0" + date_ob.getDate()).slice(-2) + "_" + date_ob.getHours() + "_" + date_ob.getMinutes() + ".txt";
    (0, _writeCSV.writeCSV)(filepath);
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