import fs from 'fs';
import {dataCollection} from './app';

export function writeCSV(filepath) {
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