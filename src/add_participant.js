import {dataCollection} from './app';

const fields = ['id', 'age', 'gender', 'handedness', 'specialty', 'years', 'percent', 'responsibilities',
    'years_retired', 'activities', 'contribute', 'track', 'testing', 'ethical', 'additional', 'name', 'email'];
const idLength = 6;
const ageLimits = [17, 125];

export function add_participant(req_body) {
    let dataRef = dataCollection.doc(req_body.id);
    for (let key in req_body) {
        if (req_body.hasOwnProperty(key)) {
            let setData = dataRef.set({
                key: req_body[key]
            }, {merge: true})
        } else {
            let setData = dataRef.set({
                key: ''
            })
        }
    }
}