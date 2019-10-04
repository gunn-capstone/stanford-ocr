const express = require('express');
const app = express();

const port = 8080;
const admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://<stanford-ocr>.firebaseio.com'
});

const db = admin.firestore();
const pdfCollection = db.collection('pdfCollection');
const dataCollection = db.collection('dataCollection');

function hashCode (s){
    let h = 0, l = s.length, i = 0;
    if ( l > 0 )
        while (i < l)
            h = (h << 5) - h + s.charCodeAt(i++) | 0;
    return h;
}

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/addname', (req, res) => {
    console.log('posted');
    let dataRef = dataCollection.doc(hashCode(req.getElementById('lastName')).toString());
    let setData = dataRef.set({
        lastName: req.getElementById('lastName'),
        firstName: req.getElementById('firstName')
    }, {merge:true});
});

app.get('/data', function (req, res,html) {
    res.sendFile(__dirname+'/data.html');
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