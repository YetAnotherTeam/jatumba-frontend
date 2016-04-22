import {Instrument} from "./instrument.model";

export const INSTRUMENT_LIST: Instrument[] = [
    {
        id: 3,
        name: "metronome",
        soundList: [
            {
                id: 6,
                name: "hi",
                sound: "metronome",
                active: true
            }
        ],
        active: false
    }, {
        id: 1,
        name: 'agogo',
        soundList: [
            {
                id: 1,
                name: "hi",
                sound: "agogo-hi",
                active: true
            },
            {
                id: 2,
                name: "lo",
                sound:"agogo-lo",
                active: false
            }
        ],
        active: true
    }, {
        id: 2,
        name: "djembe",
        soundList: [
            {
                id: 4,
                name: "hi",
                sound: "djembe-hi",
                active:true
            },
            {
                id: 3,
                name: "mid",
                sound: "djembe-mid",
                active: false
            },
            {
                id: 5,
                name: "lo",
                sound: "djembe-lo",
                active: false
            }
        ],
        active: false
    }
];