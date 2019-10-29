'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.writeCSV = writeCSV;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _app = require('./app');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function writeCSV(filepath) {
    var file = _fs2.default.createWriteStream(filepath);
    file.write('banana');

    _app.dataCollection.get().then(function (dataDoc) {
        dataDoc.forEach(function (doc) {});
    }).catch(function (err) {
        console.log('Error getting documents', err);
    });
    file.end();
}