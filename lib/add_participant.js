'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.add_participant = add_participant;

var _app = require('./app');

var fields = ['id', 'age', 'gender', 'handedness', 'specialty', 'years', 'percent', 'responsibilities', 'years_retired', 'activities', 'contribute', 'track', 'testing', 'ethical', 'additional', 'name', 'email'];
var idLength = 6;
var ageLimits = [17, 125];

function add_participant(req_body) {
    var dataRef = _app.dataCollection.doc(req_body.id);
    for (var key in req_body) {
        if (req_body.hasOwnProperty(key)) {
            console.log(key);
            var setData = dataRef.set({
                key: req_body[key]
            }, { merge: true });
        } else {
            var _setData = dataRef.set({
                key: ''
            });
        }
    }
}