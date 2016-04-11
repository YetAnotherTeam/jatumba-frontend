System.register(['angular2/core', "angular2/router", "../auth/auth.service", "./editor.service"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, router_1, auth_service_1, editor_service_1;
    var EditorComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (auth_service_1_1) {
                auth_service_1 = auth_service_1_1;
            },
            function (editor_service_1_1) {
                editor_service_1 = editor_service_1_1;
            }],
        execute: function() {
            EditorComponent = (function () {
                function EditorComponent(_router, _authService, _editorService) {
                    this._router = _router;
                    this._authService = _authService;
                    this._editorService = _editorService;
                    this.isPlay = false;
                    this._emptySectorList = [];
                    var self = this;
                    this._authService.isAuth().then(function (isAuth) {
                        if (!isAuth) {
                            self._router.navigate(['Login']);
                        }
                    });
                    this._setLinePosition(0);
                    this._playIdTimer = 0;
                    this.instrumentList = [];
                    this.trackList = [];
                    this.soundMap = {
                        "djembe-hi": new Howl({ urls: ['sound/djembe-hi.wav'] }),
                        "djembe-lo": new Howl({ urls: ['sound/djembe-lo.wav'] }),
                        "djembe-mid": new Howl({ urls: ['sound/djembe-mid.wav'] }),
                        "agogo-hi": new Howl({ urls: ['sound/agogo-hi.wav'] }),
                        "agogo-lo": new Howl({ urls: ['sound/agogo-lo.wav'] }),
                        "metronome": new Howl({ urls: ['sound/metronomeup.wav'] })
                    };
                }
                ;
                EditorComponent.prototype.ngOnInit = function () {
                    var self = this;
                    this.bpm = 90;
                    var metronomeSectorList = [];
                    for (var i = 0; i < 32; i++) {
                        if (i % 8 == 0) {
                            metronomeSectorList.push({
                                val: 'hi',
                                sound: "metronome"
                            });
                        }
                        else {
                            metronomeSectorList.push({
                                val: 'empty',
                                sound: false
                            });
                        }
                    }
                    this._editorService.getInstrumentList()
                        .then(function (instrumentList) {
                        self.instrumentList = instrumentList;
                        self.trackList.push({
                            id: 1,
                            instrument: self.instrumentList[0],
                            sectorList: metronomeSectorList
                        });
                        self.changeActiveInstrument(self.instrumentList[0]);
                    });
                };
                EditorComponent.prototype.ngOnDestroy = function () {
                    this.stop();
                };
                EditorComponent.prototype.changeActiveInstrument = function (instrument) {
                    for (var _i = 0, _a = this.instrumentList; _i < _a.length; _i++) {
                        var instrumentItem = _a[_i];
                        instrumentItem.active = false;
                    }
                    instrument.active = true;
                    this.activeInstrument = instrument;
                };
                EditorComponent.prototype.createTrack = function () {
                    this.trackList.push({
                        id: this.trackList[this.trackList.length - 1].id + 1,
                        instrument: this.activeInstrument,
                        sectorList: this._createEmptyTrack()
                    });
                };
                EditorComponent.prototype.addSound = function (track, index) {
                    var instrument = this.activeInstrument;
                    if (track.instrument == instrument) {
                        for (var i in instrument.soundList) {
                            if (instrument.soundList[i].active) {
                                track.sectorList[index].val = instrument.soundList[i].name;
                                track.sectorList[index].sound = instrument.soundList[i].sound;
                            }
                        }
                    }
                };
                EditorComponent.prototype.mappingSoundValToType = function (string) {
                    var mapper = {
                        hi: 'type-1',
                        mid: 'type-2',
                        lo: 'type-3'
                    };
                    return mapper[string] ? mapper[string] : string;
                };
                EditorComponent.prototype.changeActiveSound = function (soundName) {
                    var instrument = this.activeInstrument;
                    for (var i in instrument.soundList) {
                        instrument.soundList[i].active = instrument.soundList[i].name == soundName;
                    }
                };
                EditorComponent.prototype.play = function () {
                    this.isPlay = true;
                    var allSoundList = {};
                    for (var _i = 0, _a = this.trackList; _i < _a.length; _i++) {
                        var track = _a[_i];
                        for (var segment in track.sectorList) {
                            if (track.sectorList[segment].sound) {
                                if (!allSoundList[segment]) {
                                    allSoundList[segment] = [];
                                }
                                allSoundList[segment].push(this.soundMap[track.sectorList[segment].sound]);
                            }
                        }
                    }
                    var tickTime = 10;
                    var sizeWavePx = 8 * 32; // 8px палочка 32 делений
                    var self = this;
                    var speed = (((sizeWavePx / 4 * (this.bpm / 60)) / 1000) * tickTime);
                    var start = Date.now();
                    var time = 0;
                    var exit = 0;
                    var num = 0;
                    var diff = 0;
                    var instance = function () {
                        self._setLinePosition((self._linePositionNumber + speed) % sizeWavePx);
                        var exit = Math.floor(self._linePositionNumber / 8);
                        var num = 1;
                        for (var num_1 = Math.floor((self._linePositionNumber - speed) / 8); num_1 < exit; num_1 += 1) {
                            if (allSoundList[num_1]) {
                                for (var _i = 0, _a = allSoundList[num_1]; _i < _a.length; _i++) {
                                    var sound = _a[_i];
                                    sound.play();
                                }
                            }
                        }
                        time += tickTime;
                        diff = (Date.now() - start) - time;
                        self._playIdTimer = setTimeout(instance, (tickTime - diff));
                    };
                    this.stop();
                    setTimeout(instance, tickTime);
                };
                EditorComponent.prototype.stop = function () {
                    if (this._playIdTimer) {
                        this.isPlay = false;
                        clearTimeout(this._playIdTimer);
                        this._playIdTimer = 0;
                        this._setLinePosition(0);
                    }
                };
                EditorComponent.prototype._setLinePosition = function (number) {
                    this._linePositionNumber = number;
                    this.linePosition = 'translateX(' + (this._linePositionNumber) + 'px)';
                };
                EditorComponent.prototype._createEmptyTrack = function () {
                    var emptySectorList = [];
                    for (var i = 0; i < 32; i++) {
                        emptySectorList.push({
                            val: 'empty',
                            sound: false
                        });
                    }
                    return emptySectorList;
                };
                EditorComponent = __decorate([
                    core_1.Component({
                        selector: 'editor',
                        providers: [editor_service_1.EditorService],
                        templateUrl: '/app/editor/editor.component.html',
                        styleUrls: ['app/editor/editor.component.css', 'app/editor/material-indigo-pink.css'],
                    }), 
                    __metadata('design:paramtypes', [router_1.Router, auth_service_1.AuthService, editor_service_1.EditorService])
                ], EditorComponent);
                return EditorComponent;
            }());
            exports_1("EditorComponent", EditorComponent);
        }
    }
});
//# sourceMappingURL=editor.component.js.map