'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.detect = detect;

var _vision = require('@google-cloud/vision');

var _vision2 = _interopRequireDefault(_vision);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function detect() {
    var client = new _vision2.default.ImageAnnotatorClient();

    var fileName = __dirname + '/../resources/image 2.jpg';

    var _ref = await client.documentTextDetection(fileName),
        _ref2 = _slicedToArray(_ref, 1),
        result = _ref2[0];

    var fullTextAnnotation = result.fullTextAnnotation;
    console.log('Full text: ' + fullTextAnnotation.text);
    fullTextAnnotation.pages.forEach(function (page) {
        page.blocks.forEach(function (block) {
            console.log('Block confidence: ' + block.confidence);
            block.paragraphs.forEach(function (paragraph) {
                console.log('Paragraph confidence: ' + paragraph.confidence);
                paragraph.words.forEach(function (word) {
                    var wordText = word.symbols.map(function (s) {
                        return s.text;
                    }).join('');
                    console.log('Word text: ' + wordText);
                    console.log('Word confidence: ' + word.confidence);
                    word.symbols.forEach(function (symbol) {
                        console.log('Symbol text: ' + symbol.text);
                        console.log('Symbol confidence: ' + symbol.confidence);
                    });
                });
            });
        });
    });
}