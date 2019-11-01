'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.uploadImageToStorage = undefined;

var _storage = require('@google-cloud/storage');

var Storage = _interopRequireWildcard(_storage);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var storage = new Storage({
    projectId: 'stanford-ocr'
});

var bucket = storage.bucket('stanford_ocr');

var uploadImageToStorage = exports.uploadImageToStorage = function uploadImageToStorage(file) {
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