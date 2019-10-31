'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.add_participant = add_participant;

var _app = require('./app');

function add_participant(req_body) {
    var dataRef = _app.dataCollection.doc(req_body.id);
    var setData = dataRef.set({
        id: req_body.id,
        age: req_body.age,
        gender: req_body.gender,
        specialty: req_body.specialty,
        years: req_body.years,
        percent: req_body.percent,
        activities: req_body.activities,
        additional: req_body.additional,
        name: req_body.name,
        email: req_body.email
    }, { merge: true });
}