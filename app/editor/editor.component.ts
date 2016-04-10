import {Component, OnInit, OnDestroy} from 'angular2/core';
import {Router} from "angular2/router";
import {AuthService} from "../auth/auth.service";
import {Instrument} from "./instrument.model";
import {EditorService} from "./editor.service";
import {Track} from "./track.model";
import * as howler from "howler";

@Component({
    selector: 'editor',
    providers: [EditorService],
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

    constructor(private _router: Router, private _authService: AuthService, private _editorService: EditorService) {
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

        let metronomeSectorList = [];

        for (let i = 0; i < 32; i++) {
            if (i % 8 == 0) {
                metronomeSectorList.push({
                    val: 'hi',
                    sound: "metronome"
                });
            } else {
                metronomeSectorList.push({
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
                    sectorList: metronomeSectorList
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
    
    addSound(track: Track, index) {
        let instrument: Instrument = this.activeInstrument;

        if (track.instrument == instrument) {
            for (let i in instrument.soundList) {
                if (instrument.soundList[i].active) {
                    track.sectorList[index].val = instrument.soundList[i].name;
                    track.sectorList[index].sound = instrument.soundList[i].sound;
                }
            }
        }
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
        let allSoundList = {};
        for (let track of this.trackList) {
            for (let segment in track.sectorList) { // 32 сегмента
                if (track.sectorList[segment].sound) {
                    if(!allSoundList[segment]) {
                        allSoundList[segment] = [];
                    }

                    allSoundList[segment].push(this.soundMap[track.sectorList[segment].sound]);
                }
            }
        }


        let tickTime = 10;
        let sizeWavePx = 8 * 32; // 8px палочка 32 делений
        let self = this;
        let speed = (((sizeWavePx/4 * (this.bpm / 60))/1000)*tickTime);

        let start = Date.now();

        let time = 0;
        let exit = 0;
        let num = 0;
        let diff = 0;


        var instance = function () {
            self._setLinePosition((self._linePositionNumber + speed) % sizeWavePx);
            let exit = Math.floor(self._linePositionNumber/8);
            let num = 1;
            for (let num = Math.floor((self._linePositionNumber - speed) / 8); num < exit; num +=1) {
                if (allSoundList[num]) {
                    for (let sound of allSoundList[num]) {
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
}
