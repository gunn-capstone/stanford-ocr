const express = require('express'); // Express.js setup
const app = express();
const dirPublic = (__dirname + '/../public');
app.use(express.static(dirPublic));

const admin = require('firebase-admin'); // firebase setup
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://stanford-ocr.firebaseio.com'
});
const db = admin.firestore();
const dataCollection = db.collection('dataCollection');
console.log('Firebase Initialized');

const bodyParser = require('body-parser'); // parses req body into json object
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function (req, res) {
    res.send(dirPublic + 'index.html');
});

app.post('/addparticipant', (req, res) => { // TODO data validation
    let dataRef = dataCollection.doc(req.body.id);
    let setData = dataRef.set({
        id: req.body.id, // TODO for loop
        age: req.body.age,
        gender: req.body.gender,
        specialty: req.body.specialty,
        years: req.body.years,
        percent: req.body.percent,
        activities: req.body.activities,
        additional: req.body.additional,
        name: req.body.name,
        email: req.body.email
    }, {merge: true});
    res.sendFile('form.html', {root: dirPublic});
});

const fs = require('fs');

function writeCSV(filepath) {
    let file = fs.createWriteStream(filepath);
    file.write('banana');

    dataCollection.get()
        .then(dataDoc => {
            dataDoc.forEach(doc => {
            })
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
    file.end();
}

app.get('/download', function (req, res) {
    let date_ob = new Date();
    let filepath = `${__dirname}/../survey_data_` +
        date_ob.getFullYear() + "_" + ("0" + (date_ob.getMonth() + 1)).slice(-2) +
        "_" + ("0" + date_ob.getDate()).slice(-2) + "_" + date_ob.getHours() + "_" + date_ob.getMinutes() + ".txt";
    writeCSV(filepath);
    res.download(filepath); // i dont know why this doesnt fucking work
});

async function detect() {
    const vision = require('@google-cloud/vision');
    const client = new vision.ImageAnnotatorClient();

    const fileName = __dirname + '/resources/image 2.jpg';
    const [result] = await client.documentTextDetection(fileName);
    const fullTextAnnotation = result.fullTextAnnotation;
    console.log(`Full text: ${fullTextAnnotation.text}`);
    fullTextAnnotation.pages.forEach(page => {
        page.blocks.forEach(block => {
            console.log(`Block confidence: ${block.confidence}`);
            block.paragraphs.forEach(paragraph => {
                console.log(`Paragraph confidence: ${paragraph.confidence}`);
                paragraph.words.forEach(word => {
                    const wordText = word.symbols.map(s => s.text).join('');
                    console.log(`Word text: ${wordText}`);
                    console.log(`Word confidence: ${word.confidence}`);
                    word.symbols.forEach(symbol => {
                        console.log(`Symbol text: ${symbol.text}`);
                        console.log(`Symbol confidence: ${symbol.confidence}`);
                    });
                });
            });
        });
    });
}

app.get('/test', function (req, res) { // doesnt work yet but whatever
    detect();
    res.send('huh');
});

const port = process.env.port || 8080;
app.listen(port, () => {
    console.log("Server listening on port " + port);
});