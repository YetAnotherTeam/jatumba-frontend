import {Instrument} from "./instrument.model";

export const INSTRUMENT_LIST: Instrument[] = [
    {
        id: 1,
        name: "metronome",
        soundList: {
            hi: {
                name: "hi",
                sound: "metronome",
                active: true
            }
        },
        active: false
    }, {
        id: 2,
        name: 'agogo',
        soundList: {
            hi: {
                name: "hi",
                sound: "agogo-hi",
                active: true
            },
            lo: {
                name: "lo",
                sound:"agogo-lo",
                active: false
            }
        },
        active: true
    }, {
        id: 3,
        name: "djembe",
        soundList: {
            hi: {
                name: "hi",
                sound: "djembe-hi",
                active:true
            },
            mid: {
                name: "mid",
                sound: "djembe-mid",
                active: false
            },
            lo: {
                name: "lo",
                sound: "djembe-lo",
                active: false
            }
        },
        active: false
    }
];