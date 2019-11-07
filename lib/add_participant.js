'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.add_participant = add_participant;

var _app = require('./app');

var idLength = 6;
var ageLimits = [17, 125];

function add_participant(req_body, res) {
    // whatever ill fix this later or something
    var dataRef = _app.dataCollection.doc(req_body.id);
    if (req_body.id.length !== idLength) return;
    if (req_body.age >= ageLimits[0] && req_body.age <= ageLimits[1]) return;
    var setData = dataRef.set({
        id: req_body.id,
        age: req_body.age,
        gender: req_body.gender,
        handedness: req_body.handedness,
        specialty: req_body.specialty,
        years: req_body.years,
        percent: req_body.percent,
        responsibilities: req_body.responsibilities,
        years_retired: req_body.years_retired,
        activities: req_body.activities,
        contribute: req_body.contribute,
        track: req_body.track,
        testing: req_body.testing,
        ethical: req_body.ethical,
        additional: req_body.additional,
        name: req_body.name,
        email: req_body.email
    }, { merge: true });
}