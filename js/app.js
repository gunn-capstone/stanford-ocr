const express = require('express');
const app = express();
app.use(express.static(__dirname));

const port = 8080;
const admin = require('firebase-admin');

admin.initializeApp({
    // credential: admin.credential.cert(JSON.parse(process.env.GCP_CRED)),
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://stanford-ocr.firebaseio.com'
});

const db = admin.firestore();
const pdfCollection = db.collection('pdfCollection');
const dataCollection = db.collection('dataCollection');

function hashCode(s) {
    let h = 0, l = s.length, i = 0;
    if (l > 0)
        while (i < l)
            h = (h << 5) - h + s.charCodeAt(i++) | 0;
    return h;
}

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


app.post('/addname', (req, res) => {
    let dataRef = dataCollection.doc(hashCode(req.body.lastName).toString());
    let setData = dataRef.set({
        lastName: req.body.lastName,
        firstName: req.body.firstName
    }, {merge: true});
    res.send('gay');
});

app.get('/data', function (req, res, html) {
    res.sendFile(__dirname + '/data.html');
});

app.get('/data', function (req, res, html) {
    res.sendFile(__dirname + '/data.html');
});

app.get('/index', function (req, res, html) {
    res.sendFile(__dirname + '/index.html');
});

app.listen(port, () => {
    console.log("Server listening on port " + port);
});