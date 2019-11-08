import {dataCollection} from './app';

export function add_participant(req_body) {
    let dataRef = dataCollection.doc(req_body.id);
    let setData = dataRef.set({
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
    }, {merge: true});
}