import {Instrument} from "./instrument.model";

export const INSTRUMENT_LIST: Instrument[] = [
    {
        id: 3,
        name: "metronome",
        sounds: [
            {
                id: 6,
                name: "hi",
                soundName: "metronome",
                active: true
            }
        ],
        active: false
    }, {
        id: 1,
        name: 'agogo',
        sounds: [
            {
                id: 1,
                name: "hi",
                soundName: "agogo-hi",
                active: true
            },
            {
                id: 2,
                name: "lo",
                soundName:"agogo-lo",
                active: false
            }
        ],
        active: true
    }, {
        id: 2,
        name: "djembe",
        sounds: [
            {
                id: 4,
                name: "hi",
                soundName: "djembe-hi",
                active:true
            },
            {
                id: 3,
                name: "mid",
                soundName: "djembe-mid",
                active: false
            },
            {
                id: 5,
                name: "lo",
                soundName: "djembe-lo",
                active: false
            }
        ],
        active: false
    }
];