import {Component, OnInit, OnDestroy} from 'angular2/core';
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

    public instrumentList: Instrument[];
    public trackList: Track[];

    public linePosition: string;
    private _linePositionNumber: number;

    public activeInstrument: Instrument;

    public isPlay = false;
    private _playIdTimer: number;



    private soundMap: any;

    public bpm: number;

    private _emptySectorList = [];

    constructor(private _router: Router,
                private _authService: AuthService,
                private _editorService: EditorService,
                private _editorSocketService: EditorSocketService) {
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
                    val: 'hi',
                    sound: "metronome"
                });
            } else {
                metronomeSoundList.push({
                    val: 'empty',
                    sound: false
                });
            }
        }

        this._editorService.getInstrumentList()
            .then(instrumentList => {
                self.instrumentList = instrumentList;
                self.trackList.push({
                    id: 1,
                    instrument: self.instrumentList[0],
                    sectorList: [
                        {soundList: metronomeSoundList},
                        {soundList: metronomeSoundList}
                    ]
                });
                self.changeActiveInstrument(self.instrumentList[0]);
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
        this.trackList.push({
            id: this.trackList[this.trackList.length - 1].id + 1,
            instrument: this.activeInstrument,
            sectorList: this._createEmptyTrack()
        })
    }
    
    addSound(track: Track, indexSector, indexSound) {
        let instrument: Instrument = this.activeInstrument;

        if (track.instrument == instrument) {
            for (let i in instrument.soundList) {
                if (instrument.soundList[i].active) {
                    track.sectorList[indexSector].soundList[indexSound].val = instrument.soundList[i].name;
                    track.sectorList[indexSector].soundList[indexSound].sound = instrument.soundList[i].sound;
                    track.sectorList[indexSector].soundListID[indexSound] = instrument.soundList[i].id;
                }
            }
        }
    }

    removeSound(event: MouseEvent, track: Track,indexSector, indexSound){
        let instrument: Instrument = this.activeInstrument;

        if (track.instrument == instrument) {
            track.sectorList[indexSector].soundList[indexSound].val = 'empty';
            track.sectorList[indexSector].soundList[indexSound].sound = false;
        }
        event.preventDefault();
    }

    mappingSoundValToType(string: string) {
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
            instrument.soundList[i].active = instrument.soundList[i].name == soundName
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

    _setLinePosition(number) {
        this._linePositionNumber = number;
        this.linePosition = 'translateX('+ (this._linePositionNumber) + 'px)';
    }

    private send() {
        this._editorSocketService.send('{"test":"hello"}');
    }

    private _createEmptyTrack() {
        let emptySectorList = [];
        for (let i = 0; i < 32; i++) {
            emptySectorList.push({
                val: 'empty',
                sound: false
            });
        }

        return emptySectorList;

    }

    private _createEmptyTrackID() {
        let emptyIDList = [];
        for (let i = 0; i < 32; i++) {
            emptyIDList.push(0);
        }

        return emptyIDList;
    }
}
