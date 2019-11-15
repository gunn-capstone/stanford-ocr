import express from 'express';
import {addParticipant} from './addParticipant';
import {writeCSV} from './writeCSV';
import {detect} from './detect';
import admin from 'firebase-admin';
import bodyParser from 'body-parser';

// express for web handling
const app = express();
const dirPublic = (__dirname + '/../public');
app.use(express.static(dirPublic));

// firestore for database and file storage
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://stanford-ocr.firebaseio.com'
});
const db = admin.firestore();
export const dataCollection = db.collection('dataCollection');
console.log('Firebase Initialized');

// body parser for req body parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function (req, res) {
    res.send(dirPublic + 'index.html');
});

// add form data to database
app.post('/addParticipant', (req, res) => {
    addParticipant(req.body, res);
    res.sendFile('form.html', {root: dirPublic});
});

// to write database to csv file for export; doesnt work idk why
app.get('/download', function (req, res) {
    let date_ob = new Date();
    let filepath = `${__dirname}/../survey_data_` +
        date_ob.getFullYear() + "_" + ("0" + (date_ob.getMonth() + 1)).slice(-2) +
        "_" + ("0" + date_ob.getDate()).slice(-2) + "_" + date_ob.getHours() + "_" + date_ob.getMinutes() + ".txt";
    writeCSV(filepath);
    res.download(filepath);
});

// test of google cloud vision; will be ported to python script by quinn and justin ig
app.get('/test', function (req, res) {
    detect().then(r => {
    });
    res.send('huh');
});

// const json2csv = require("json2csv").parse;

// exports.csvJsonReport = functions.https.onRequest((request, response) => {

//   const db = admin.firestore();
//   const ordersRef = db.collection('dataCollection');
//   return ordersRef.get()
//     .then((querySnapshot) => {
//       const dataCollection = [];

//       querySnapshot.forEach(doc => {
//         const order = doc.data();
//         dataCollection.push(order);
//       });
//       const csv = json2csv(dataCollection);
//       response.setHeader(
//         "Content-disposition",
//         "attachment; filename=report.csv"
//       );
//       response.set("Content-Type", "text/csv");
//       response.status(200).send(csv)
//     }).catch((err) => {
//       console.log(err);
//     });

// });


const port = process.env.port || 8080;
app.listen(port, () => {
    console.log("Server listening on port " + port);
});