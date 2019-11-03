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

var googleStorage = require('@google-cloud/storage');
var Multer = require('multer');

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

// -------------------------------------
var storage = googleStorage({
  projectId: "<Firebase Project ID",
  keyFilename: "<path to service accounts prviate key JSON>"
});
var bucket = storage.bucket("<Firebase Storage Bucket URL");

var multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
  }
});

app.post('/upload_file', multer.single('file'), function (req, res) {
  console.log('Upload Image');

  var file = req.file;
  if (file) {
    uploadImageToStorage(file).then(function (success) {
      res.status(200).send({
        status: 'success'
      });
    }).catch(function (error) {
      console.error(error);
    });
  }
});

/**
 * Upload the image file to Google Storage
 * @param {File} file object that will be uploaded to Google Storage
 */
var uploadImageToStorage = function uploadImageToStorage(file) {
  return new Promise(function (resolve, reject) {
    if (!file) {
      reject('No image file');
    }
    var newFileName = file.originalname + '_' + Date.now();

    var fileUpload = bucket.file(newFileName);

    var blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype
      }
    });

    blobStream.on('error', function (error) {
      reject('Something is wrong! Unable to upload at the moment.');
    });

    blobStream.on('finish', function () {
      // The public URL can be used to directly access the file via HTTP.
      var url = format('https://storage.googleapis.com/' + bucket.name + '/' + fileUpload.name);
      resolve(url);
    });

    blobStream.end(file.buffer);
  });
};

// -----------------------------------------
app.get('/', function (req, res) {
  res.send(dirPublic + 'index.html');
});

app.post('/add_participant', function (req, res) {
  (0, _add_participant.add_participant)(req.body);
  console.log("User has been added");
  res.sendFile('form.html', { root: dirPublic });
});

app.get('/download', function (req, res) {
  // i dunno why this doesnt work
  var date_ob = new Date();
  var filepath = __dirname + '/../survey_data_' + date_ob.getFullYear() + "_" + ("0" + (date_ob.getMonth() + 1)).slice(-2) + "_" + ("0" + date_ob.getDate()).slice(-2) + "_" + date_ob.getHours() + "_" + date_ob.getMinutes() + ".txt";
  (0, _write_csv.writeCSV)(filepath);
  res.download(filepath);
});

// app.post('/upload_file', (req, res) => {
//     // var form = document.querySelector(fileUpload);

//     // form.addEventListener('submit', function(event) {
//     //     event.preventDefault();
//     //     var timestamp = Number(new Date());
//     //     var storageRef = firebase.storage().ref(timestamp.toString());
//     //     // create reference to the firebase storage, along with the timestamp accessed

//     //     var $ = jQuery;
//     //     var file_data = $('/fileUpload').prop('files')[0];
//     //     storageRef.put(file_data);
//     // }

//     const ref = firebase.storage().ref();
//     const file = document.querySelector('#photo').files[0]
//     const name = (+new Date()) + '-' + file.name;
//     const metadata = {
//       contentType: file.type
//   };
//   const task = ref.child(name).put(file, metadata);
//   task
//   .then(snapshot => snapshot.ref.getDownloadURL())
//   .then((url) => {
//     console.log(url);
//     document.querySelector('#someImageTagID').src = url;
// })
//   .catch(console.error);

// });


// app.get('/test', function (req, res) { // huh why this no work
//     detect().then(r => {
//     });
//     res.send('huh');
// });

var port = process.env.port || 8080;
app.listen(port, function () {
  console.log("Server listening on port " + port);
});