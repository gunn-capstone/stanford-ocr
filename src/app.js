const express = require('express');
const app = express();
const dirPublic = (__dirname + '/../public');
app.use(express.static(dirPublic));

const port = 8080;
const admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://stanford-ocr.firebaseio.com'
});

const db = admin.firestore();
const dataCollection = db.collection('dataCollection');

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    // res.sendFile(dirPublic + '/form.html');
    res.sendFile('form.html', {root: './public/views'});
});


app.post('/addparticipant', (req, res) => { // TODO data validation for id, age, years, percent, name, email
    let dataRef = dataCollection.doc(req.body.id);
    let setData = dataRef.set({
        id: req.body.id, // TODO for loop
        age: req.body.age,
        gender: req.body.gender,
        specialty: req.body.specialty, // TODO set so "other" option works correctly
        years: req.body.years,
        percent: req.body.percent,
        activities: req.body.activities,
        // contribute: req.body.contribute, TODO fix so checkboxes input data to firestore
        // track: req.body.track,
        // testing: req.body.testing,
        // ethical: req.body.ethical,
        additional: req.body.additional,
        name: req.body.name,
        email: req.body.email
    }, {merge: true});
    res.send('gay');
});

app.post('/upload', (req, res) => {
    // let dataRef = dataCollection.doc(hashCode(req.body.lastName).toString());
    // let setData = dataRef.set({
    //     lastName: req.body.lastName,
    //     firstName: req.body.firstName
    // }, {merge: true});
    res.send('gay');
});

app.get('/data', function (req, res, html) {
    res.sendFile(dirPublic + '/data.html');
});

app.get('/data', function (req, res, html) {
    res.sendFile(dirPublic + '/data.html');
});

app.get('/index', function (req, res, html) {
    res.sendFile(dirPublic + '/form.html');
});

app.listen(port, () => {
    console.log("Server listening on port " + port);
});