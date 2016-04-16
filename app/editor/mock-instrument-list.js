System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var INSTRUMENT_LIST;
    return {
        setters:[],
        execute: function() {
            exports_1("INSTRUMENT_LIST", INSTRUMENT_LIST = [
                {
                    id: 1,
                    name: "metronome",
                    soundList: [
                        {
                            name: "hi",
                            sound: "metronome",
                            active: true
                        }
                    ],
                    active: false
                }, {
                    id: 2,
                    name: 'agogo',
                    soundList: [
                        {
                            name: "hi",
                            sound: "agogo-hi",
                            active: true
                        },
                        {
                            name: "lo",
                            sound: "agogo-lo",
                            active: false
                        }
                    ],
                    active: true
                }, {
                    id: 3,
                    name: "djembe",
                    soundList: [
                        {
                            name: "hi",
                            sound: "djembe-hi",
                            active: true
                        },
                        {
                            name: "mid",
                            sound: "djembe-mid",
                            active: false
                        },
                        {
                            name: "lo",
                            sound: "djembe-lo",
                            active: false
                        }
                    ],
                    active: false
                }
            ]);
        }
    }
});
//# sourceMappingURL=mock-instrument-list.js.map