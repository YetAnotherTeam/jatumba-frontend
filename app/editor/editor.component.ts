import {Component, OnInit, OnDestroy, NgZone} from 'angular2/core';
import {Router} from "angular2/router";
import {AuthService} from "../auth/auth.service";
import {Instrument} from "./instrument.model";
import {EditorService, EditorSocketService} from "./editor.service";
import {Track} from "./track.model";
import * as howler from "howler";

@Component({
    selector: 'editor',
    providers: [EditorService, EditorSocketService],
    directives: [],
    templateUrl: '/app/editor/editor.component.html',
    styleUrls: ['app/editor/editor.component.css', 'app/editor/material-indigo-pink.css'],
})
export class EditorComponent implements OnInit, OnDestroy {
    public isEditorMode: boolean;
    public id: number;

    public instrumentList: Instrument[];
    public trackList: Track[];
    public trackListID: number[][][];

    public linePosition: string;
    private _linePositionNumber: number;

    public activeInstrument: Instrument;

    public isPlay = false;
    private _playIdTimer: number;


    private soundMap: any;
    private soundMapID: any;
    private instrumentMapID: any;

    public bpm: number;

    private _emptySectorList = [];

    constructor(private _router: Router,
                private _authService: AuthService,
                private _editorService: EditorService,
                private _editorSocketService: EditorSocketService,
                private _ngZone: NgZone) {
        var self = this;
        this._authService.isAuth().then(function(isAuth) {
            if (!isAuth) {
                self._router.navigate(['Login']);
            }
        });
        this._setLinePosition(0);
        this._playIdTimer = 0;
        this.instrumentList = [];
        this.trackList = [];
        this.trackListID = [];
        this.isEditorMode = false;

        this.instrumentMapID = {};
        this.soundMapID = {};
        EditorSocketService.setOnMessageHandler.call(this, this._onSocketMessageHandler, this._editorSocketService.getSocket())

        this._editorSocketService.socketSignIn();

        this.soundMap = {
            "djembe-hi" : new Howl({urls: ['sound/djembe-hi.wav']}),
            "djembe-lo" : new Howl({urls: ['sound/djembe-lo.wav']}),
            "djembe-mid" : new Howl({urls: ['sound/djembe-mid.wav']}),
            "agogo-hi" : new Howl({urls: ['sound/agogo-hi.wav']}),
            "agogo-lo" : new Howl({urls: ['sound/agogo-lo.wav']}),
            "metronome" : new Howl({urls: ['sound/metronomeup.wav']})
        };
    };

    ngOnInit() {
        var self = this;

        this.bpm = 90;

        let metronomeSoundList = [];

        for (let i = 0; i < 32; i++) {
            if (i % 8 == 0) {
                metronomeSoundList.push({
                    name: 'hi',
                    sound: "metronome"
                });
            } else {
                metronomeSoundList.push({
                    name: 'empty',
                    sound: ''
                });
            }
        }

        this._editorService.getInstrumentList()
            .then(instrumentList => {
                self.instrumentList = instrumentList;
                self.trackList.push({
                    id: 0,
                    instrument: self.instrumentList[0],
                    sectorList: [
                        {soundList: metronomeSoundList},
                    ]
                });
                self.changeActiveInstrument(self.instrumentList[0]);
                self.trackListID.push([EditorComponent._createEmptyTrackID()]);
                self._createInstrumentMap();
                self._createSoundMap();
            });
    }

    ngOnDestroy():any {
        this.stop();
    }
    
    changeActiveInstrument(instrument: Instrument) {
        for(let instrumentItem of this.instrumentList) {
            instrumentItem.active = false;
        }

        instrument.active = true;

        this.activeInstrument = instrument;
    }

    createTrack() {
        if (this.isCanEdit()) {
            let countOfSectorList = this.trackList[0].sectorList.length;
            var sectorList = [];
            var sectorListID = [];
            for (let i = 0; i < countOfSectorList; i++) {
                sectorList.push({
                    soundList: EditorComponent._createEmptyTrack()
                });
                sectorListID.push(EditorComponent._createEmptyTrackID());
            }
            this.trackList.push({
                id: this.trackList[this.trackList.length - 1].id + 1,
                instrument: this.activeInstrument,
                sectorList: sectorList
            });
            this.trackListID.push(sectorListID);
            this.sendTrackDiff('test');
        }
    }

    removeTrackByIndex(event: MouseEvent, index: number) {
        if (this.isCanEdit()) {
            if (this.trackList[index].instrument.active) {
                this.trackList.splice(index, 1);
            }
            event.preventDefault();
        }
    }
    
    addSound(track: Track, indexSector, indexSound) {
        if (this.isCanEdit()) {
            let instrument:Instrument = this.activeInstrument;
            if (track.instrument == instrument) {
                for (let i in instrument.soundList) {
                    if (instrument.soundList[i].active) {
                        track.sectorList[indexSector].soundList[indexSound].name = instrument.soundList[i].name;
                        track.sectorList[indexSector].soundList[indexSound].sound = instrument.soundList[i].sound;
                        this.trackListID[track.id][indexSector][indexSound] = instrument.soundList[i].id;
                    }
                }
            }
            this.sendTrackDiff('test');
        }
    }

    removeSound(event: MouseEvent, track: Track,indexSector, indexSound) {
        if (this.isCanEdit()) {
            let instrument:Instrument = this.activeInstrument;

            if (track.instrument == instrument) {
                // debugger;
                track.sectorList[indexSector].soundList[indexSound].name = 'empty';
                track.sectorList[indexSector].soundList[indexSound].sound = '';
                this.trackListID[track.id][indexSector][indexSound] = null;
            }
            event.preventDefault();
            this.sendTrackDiff('test');
        }
    }

    addSector() {
        if (this.isCanEdit()) {
            for (let track of this.trackList) {
                track.sectorList.push({
                    soundList: EditorComponent._createEmptyTrack()
                });
                this.trackListID[track.id].push(EditorComponent._createEmptyTrackID());
            }
            this.sendTrackDiff('test');
        }
    }

    removeSector() {
        if (this.isCanEdit()) {
            for (let track of this.trackList) {
                track.sectorList.length = track.sectorList.length - 1
                this.trackListID[track.id].pop();
            }
            this.sendTrackDiff('test');
        }
    }

    mappingSoundNameToType(string: string) {
        let mapper = {
            hi: 'type-1',
            mid: 'type-2',
            lo: 'type-3'
        };
        return mapper[string] ? mapper[string] : string;
    }

    
    changeActiveSound(soundName: string) {
        let instrument: Instrument = this.activeInstrument;
        for (let i in instrument.soundList) {
            instrument.soundList[i].active = false;
            if (instrument.soundList[i].name == soundName) {
                instrument.soundList[i].active = true;
                this.soundMap[instrument.soundList[i].sound].play();
            }
        }
    }

    play() {

        this.isPlay = true;
        let allSoundList = [];

        for (let track of this.trackList) {
            for (let sectorNum in track.sectorList) {
                if (!allSoundList[sectorNum]) {
                    allSoundList[sectorNum] = {};
                }

                for (let segment in track.sectorList[sectorNum].soundList) { // 32 сегмента
                    if (track.sectorList[sectorNum].soundList[segment].sound) {
                        if(!allSoundList[sectorNum][segment]) {
                            allSoundList[sectorNum][segment] = [];
                        }

                        allSoundList[sectorNum][segment].push(this.soundMap[track.sectorList[sectorNum].soundList[segment].sound]);
                    }
                }
            }
        }

        let tickTime = 10;
        let sizeWavePx = 8 * 32; // 8px палочка 32 делений
        let sizeWithMultipleSector = sizeWavePx * allSoundList.length;
        let self = this;
        let speed = (((sizeWavePx/4 * (this.bpm / 60))/1000)*tickTime);

        let start = Date.now();

        let time = 0;
        let exit = 0;
        let num = 0;
        let diff = 0;

        var instance = function () {
            self._setLinePosition((self._linePositionNumber + speed) % sizeWithMultipleSector);
            let exit = Math.floor(self._linePositionNumber/8);
            let num = 1;
            for (let num = Math.floor((self._linePositionNumber - speed) / 8); num < exit; num += 1) {
                var sectorPosition = Math.floor(num/32);
                var soundPosition = num % 32;
                var flag = sectorPosition != -1; //По неведомым мне причинам иногда soundPosition и sectorPosition == -1
                if (flag) {
                    if (allSoundList[sectorPosition][soundPosition]) {
                        for (let sound of allSoundList[sectorPosition][soundPosition]) {
                            sound.play();
                        }
                    }
                }
            }

            time += tickTime;
            diff = (Date.now() - start) - time;

            self._playIdTimer = setTimeout(instance, (tickTime - diff));
        };

        this.stop();
        setTimeout(instance, tickTime);
    }


    stop() {
        if (this._playIdTimer) {
            this.isPlay = false;
            clearTimeout(this._playIdTimer);
            this._playIdTimer = 0;
            this._setLinePosition(0);
        }
    }

    changeEditorMode(state: boolean) {
        this.isEditorMode = state;
    }

    private isCanEdit() {
        return this.isEditorMode;
    }

    _setLinePosition(number) {
        this._linePositionNumber = number;
        this.linePosition = 'translateX('+ (this._linePositionNumber) + 'px)';
    }
    
    private sendTrackDiff(data: any) {
        var self = this;
        data = {
            tracks: []
        };
        this.trackList.forEach(function (track) {
            data.tracks.push({
                instrument: track.instrument.id,
                entity: self.trackListID[track.id],
                order: track.id
            })
        });
        this._editorSocketService.sendCompositionDiff(data);
    }

    private _parseComposition(tracks: any) {
        var self = this;
        this.trackList = [];
        this.trackListID = [];
        tracks.forEach(function (track) {
            self.trackListID.push(track.entity);
            var track_list = [];
            track.entity.forEach(function (sector) {
                var sector_list = [];
                sector.forEach(function (sound_id) {
                    if (sound_id) {
                        sector_list.push(JSON.parse(JSON.stringify(self.soundMapID[sound_id])));
                    } else {
                        sector_list.push({
                            name: 'empty',
                            sound: ''
                        });
                    }
                });
                track_list.push({soundList:sector_list});
            });
            self.trackList.push({
                id: self.trackListID.length - 1,
                instrument: self.instrumentMapID[track.instrument],
                sectorList: track_list
            });
        });
    }
    
    private _onSocketMessageHandler(event: MessageEvent, context: any) {
        var self = context;
        var message = JSON.parse(event.data);
        switch (message.method) {
            case 'sign_in': {
                self._parseComposition(message.data.tracks);
                break;
            }
            case 'diff': {
                self._parseComposition(message.data.tracks);
                break;
            }
        }
    }

    private static _createEmptyTrack() {
        let emptySectorList = [];
        for (let i = 0; i < 32; i++) {
            emptySectorList.push({
                name: 'empty',
                sound: ''
            });
        }

        return emptySectorList;

    }

    private static _createEmptyTrackID() {
        let emptyIDList = [];
        for (let i = 0; i < 32; i++) {
            emptyIDList.push(null);
        }

        return emptyIDList;
    }
    
    private _createSoundMap() {
        var self = this;
        this.instrumentList.forEach(function (instrument) {
            instrument.soundList.forEach(function (sound) {
                self.soundMapID[sound.id] = sound;
            })
        })
    }

    private _createInstrumentMap() {
        var self = this;
        this.instrumentList.forEach(function (instrument) {
            self.instrumentMapID[instrument.id] = instrument;
        })
    }
}
