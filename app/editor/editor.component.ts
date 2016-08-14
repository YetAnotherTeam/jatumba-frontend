import {Component, OnInit, OnDestroy, NgZone} from "angular2/core";
import {Router, RouteParams, ROUTER_DIRECTIVES} from "angular2/router";
import {AuthService} from "../auth/auth.service";
import {Instrument} from "./instrument.model";
import {EditorService, EditorSocketService} from "./editor.service";
import {Track} from "./track.model";
import * as howler from "howler";
import {Band} from "../band/band";
import {Composition} from "../band/composition";
import {ChatComponent} from "../components/chat/chat.component";
import {UserService} from "../user/user.service";
import {BandService} from "../band/band.service";
import {DatetimeUtils} from "../utils/datetime";

@Component({
    selector: 'editor',
    providers: [EditorService, EditorSocketService, UserService, BandService, DatetimeUtils],
    directives: [ChatComponent, ROUTER_DIRECTIVES],
    templateUrl: '/app/editor/editor.component.html',
    styleUrls: ['app/editor/editor.component.css', 'app/editor/material-indigo-pink.css'],
    host: {'(window:keydown)': 'onKey($event)'},
})
export class EditorComponent implements OnInit, OnDestroy {
    public isEditorMode: boolean;
    public id: number;
    public composition: Composition;

    public instrumentList: Instrument[];
    public trackList: Track[];
    public trackListID: number[][][];
    public selectedVersion: number;

    public linePosition: string;
    private _linePositionNumber: number;
    private user: any;
    private havePermissionToEdit: boolean;

    public activeInstrument: Instrument;

    public isPlay = false;
    private _playIdTimer: number;

    private soundMap: any;
    private soundMapID: any;
    private instrumentMapID: any;
    private diffID: number;
    private commits: any;
    private templateRenderTime;

    compositionList: Composition[];
    compositionListPaginationInfo: any;

    public bpm: number;
    public globalVolume: number;

    private _emptySectorList = [];

    constructor(private _router: Router,
                private _authService: AuthService,
                private _editorService: EditorService,
                private _editorSocketService: EditorSocketService,
                private _ngZone: NgZone,
                private _userService: UserService,
                private _bandService: BandService,
                private _datetimeUtils: DatetimeUtils,
                params: RouteParams) {

        this._authService.isAuth().then((isAuth) => {
            if (!isAuth) {
                this._router.navigate(['Login']);
            }
        }).catch((err) => {
            this._router.navigate(['Login']);
        });
        this.id = +params.get('id');
        this._setLinePosition(0);
        this._playIdTimer = 0;
        this.instrumentList = [];
        this.trackList = [];
        this.trackListID = [];
        this.havePermissionToEdit = false;
        this.isEditorMode = false;
        this.globalVolume = 100;
        this.templateRenderTime = new Date();

        this.instrumentMapID = {};
        this.soundMapID = {};

        // this._editorSocketService.start(this.id, this._onSocketMessageHandler, this);
    };

    ngOnInit() {
        var self = this;

        this.bpm = 60;

        let metronomeSoundList = [];

        // for (let i = 0; i < 32; i++) {
        //     if (i % 8 == 0) {
        //         metronomeSoundList.push({
        //             name: 'hi',
        //             sound: "metronome"
        //         });
        //     } else {
        //         metronomeSoundList.push({
        //             name: 'empty',
        //             sound: ''
        //         });
        //     }
        // }

        this._userService.get(JSON.parse(localStorage.getItem('user')).id).subscribe(user => {
            self.user = user;
            localStorage.setItem('user', JSON.stringify(user));
        });

        this._editorService.loadInstrumentList().subscribe(instrumentList => {
            self.instrumentList = instrumentList;
            self.instrumentList[0].active = true;
            self.instrumentList[0].sounds[0].active = true;
            self.soundMap = {};

            for (let instrument of self.instrumentList) {
                let flag = true;
                for (let currentSoundIndex in instrument.sounds) {
                    let currentSound = instrument.sounds[currentSoundIndex];
                    // Не работало сравнение currentSoundIndex == 0. Пришлось написать так
                    currentSound.active = flag;
                    flag = false;
                    currentSound.soundName = instrument.name + "-" + currentSound.name;
                    self.soundMap[currentSound.soundName] = new Howl({urls: [currentSound.file]})
                }
            }
            self.changeActiveInstrument(self.instrumentList[0]);
            self.trackListID.push([EditorComponent._createEmptyTrackID()]);
            self._createInstrumentMap();
            self._createSoundMap();

            self._editorService.get(self.id).subscribe(composition => {
                self.havePermissionToEdit = false;
                for (let perm of composition.permissions) {
                    if (perm == 'change_composition') {
                        self.havePermissionToEdit = true;
                    }
                }

                self._parseComposition(composition.latest_version.tracks);
                self.composition = composition;
                self.selectedVersion = composition.latest_version.id;
                self._bandService.composition_list(self.composition.band.id).subscribe((compositionList: any) => {
                    self._ngZone.run(() => {
                        self.compositionList = compositionList.results;
                        self.compositionListPaginationInfo = compositionList
                    })
                })
            });


        });

        self._editorService.getCommits(self.id).subscribe(commits => {
            // TODO Сделать норм пагинацию
            self.commits = commits.results;
        });

        this.browserValidate();


    }

    ngOnDestroy(): any {
        this.stop();

    }

    changeComposition(id: number) {
        this.id = id;
        var self = this;

        self._editorService.get(self.id).subscribe(composition => {
            self.havePermissionToEdit = false;
            for (let perm of composition.permissions) {
                if (perm == 'change_composition') {
                    self.havePermissionToEdit = true;
                }
            }

            self._parseComposition(composition.latest_version.tracks);
            self.composition = composition;
            self.selectedVersion = composition.latest_version.id;
            self._bandService.composition_list(self.composition.band.id).subscribe((compositionList: any) => {
                self._ngZone.run(() => {
                    self.compositionList = compositionList.results;
                    self.compositionListPaginationInfo = compositionList
                })
            })
        });

        self._editorService.getCommits(self.id).subscribe(commits => {
            // TODO Сделать норм пагинацию
            self.commits = commits.results;
        });
    }

    closeModal() {
        $('#forkModal').closeModal();
    }

    changeActiveInstrument(instrument: Instrument) {
        for (let instrumentItem of this.instrumentList) {
            instrumentItem.active = false;
        }

        instrument.active = true;

        this.activeInstrument = instrument;
    }

    createTrack() {
        if (this.isCanEdit()) {
            let countOfSectorList = 1;
            let id = 0;
            if (this.trackList.length > 0) {
                countOfSectorList = this.trackList[0].sectorList.length;
                id = this.trackList[this.trackList.length - 1].id + 1
            }
            var sectorList = [];
            var sectorListID = [];
            for (let i = 0; i < countOfSectorList; i++) {
                sectorList.push({
                    soundList: EditorComponent._createEmptyTrack()
                });
                sectorListID.push(EditorComponent._createEmptyTrackID());
            }

            this.trackList.push({
                id: id,
                instrument: this.activeInstrument,
                sectorList: sectorList,
                volume: 100
            });
            this.trackListID.push(sectorListID);
            this.sendTrackDiff('test');
        }
    }

    removeTrackByIndex(index: number) {
        if (this.isCanEdit()) {
            if (this.trackList[index].instrument.active) {
                this.trackList.splice(index, 1);
            }
            this.sendTrackDiff('');
        }
    }

    addOrRemoveSound(track: Track, indexSector, indexSound) {
        if (this.isCanEdit()) {
            let instrument: Instrument = this.activeInstrument;
            if (track.instrument == instrument) {
                if (track.sectorList[indexSector].soundList[indexSound].name == 'empty') {
                    this.addSound(track, indexSector, indexSound);
                } else {
                    this.removeSound(track, indexSector, indexSound);
                }
            }
        }
    }

    addSound(track: Track, indexSector, indexSound) {
        if (this.isCanEdit()) {
            let instrument: Instrument = this.activeInstrument;
            if (track.instrument == instrument) {
                for (let i in instrument.sounds) {
                    if (instrument.sounds[i].active) {
                        track.sectorList[indexSector].soundList[indexSound].name = instrument.sounds[i].name;
                        track.sectorList[indexSector].soundList[indexSound].soundName = instrument.sounds[i].soundName;
                        this.trackListID[track.id][indexSector][indexSound] = instrument.sounds[i].id;
                    }
                }
            }
            this.sendTrackDiff([this.trackList[track.id]]);
            this.restartPlay();
        }
    }

    removeSound(track: Track, indexSector, indexSound) {
        if (this.isCanEdit()) {
            let instrument: Instrument = this.activeInstrument;

            if (track.instrument == instrument) {
                // debugger;
                track.sectorList[indexSector].soundList[indexSound].name = 'empty';
                track.sectorList[indexSector].soundList[indexSound].soundName = '';
                this.trackListID[track.id][indexSector][indexSound] = null;
            }
            this.sendTrackDiff([this.trackList[track.id]]);
            this.restartPlay();
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
            this.sendTrackDiff(this.trackList);
        }
    }

    removeSector() {
        if (this.isCanEdit()) {
            for (let track of this.trackList) {
                track.sectorList.length = track.sectorList.length - 1
                this.trackListID[track.id].pop();
            }
            this.sendTrackDiff(this.trackList);
            this.restartPlay();
        }
    }

    mappingSoundNameToType(string: string) {
        let mapper = {
            hi: 'icon circle fill', // black circle
            mid: 'icon circle', //white circle
            lo: 'icon triangle fill', // triangle
            'bas-hi': 'icon circle fill', // black circle
            'bas': 'icon circle', //white circle
            'bas-lo': 'icon triangle fill' // triangle
        };

        return mapper[string] ? mapper[string] : 'icon';
    }


    changeActiveSound(soundName: string) {
        let instrument: Instrument = this.activeInstrument;
        for (let i in instrument.sounds) {
            instrument.sounds[i].active = false;
            if (instrument.sounds[i].name == soundName) {
                instrument.sounds[i].active = true;
                this.soundMap[instrument.sounds[i].soundName].play();
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
                    if (track.sectorList[sectorNum].soundList[segment].soundName) {
                        if (!allSoundList[sectorNum][segment]) {
                            allSoundList[sectorNum][segment] = [];
                        }
                        console.log('trackVOlume', track.volume);
                        allSoundList[sectorNum][segment].push({
                            soundVolume: track.volume,
                            howler: this.soundMap[track.sectorList[sectorNum].soundList[segment].soundName]
                        });
                    }
                }
                for (let segment in track.sectorList[sectorNum].soundList) { // 32 сегмента
                    if (track.sectorList[sectorNum].soundList[segment].soundName) {
                        for (let soundObject of allSoundList[sectorNum][segment]) {
                            soundObject.howler.volume((soundObject.soundVolume / 100) * (this.globalVolume / 100))
                        }
                    }
                }

            }
        }

        let tickTime = 10;
        let widthSound = 15; // 15px палочка
        let sizeWavePx = widthSound * 32; // 8px палочка 32 делений
        let sizeWithMultipleSector = (sizeWavePx) * allSoundList.length;
        let self = this;
        let speed = (((sizeWavePx / 4 * (this.bpm / 60)) / 1000) * tickTime);

        let start = Date.now();

        let time = 0;
        let exit = 0;
        let num = 0;
        let diff = 0;

        var instance = function () {
            self._setLinePosition((self._linePositionNumber + speed) % sizeWithMultipleSector);
            let exit = Math.floor(self._linePositionNumber / widthSound);
            for (let num = Math.floor((self._linePositionNumber - speed) / widthSound); num < exit; num += 1) {
                var sectorPosition = Math.floor(num / 32);
                var soundPosition = num % 32;
                var flag = sectorPosition != -1; //По неведомым мне причинам иногда soundPosition и sectorPosition == -1

                if (flag) {
                    if (allSoundList[sectorPosition][soundPosition]) {
                        for (let sound of allSoundList[sectorPosition][soundPosition]) {
                            sound.howler.play();
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
        var self = this;
        this.stop();
        if (this.isEditorMode) {
            this._editorSocketService.start(this.composition.id, this._onSocketMessageHandler, this);
        } else {
            this._editorSocketService.stop();
            this._editorService.get(this.id).subscribe(composition => {
                self._parseComposition(composition.latest_version.tracks);
                self.composition = composition;
                self.selectedVersion = composition.latest_version.id;
            });
        }
    }

    private isCanEdit() {
        return this.isEditorMode;
    }

    _setLinePosition(number) {
        this._linePositionNumber = number;
        this.linePosition = 'translateX(' + (this._linePositionNumber) + 'px)';
    }

    onKey(event: KeyboardEvent) {
        console.log(event.keyCode);
        if (event.keyCode == 90 && event.ctrlKey && event.shiftKey) {
            event.preventDefault();
            this._editorSocketService.historyForward(this.diffID);
        } else if (event.keyCode == 90 && event.ctrlKey) {
            event.preventDefault();
            this._editorSocketService.historyBack(this.diffID);
        } else if (event.keyCode == 83 && event.ctrlKey) {
            event.preventDefault();
            this.commitComposition()
        }
    }

    commitComposition() {
        var self = this;
        var data = {
            tracks: []
        };
        console.log(self.trackListID);
        this.trackList.forEach(function (track) {
            data.tracks.push({
                instrument: track.instrument.id,
                entity: self.trackListID[track.id],
                order: track.id
            })
        });
        this._editorSocketService.commit();
    }

    volumeChange(track: Track) {
        this.restartPlay();
    }

    private restartPlay() {
        if (this.isPlay) {
            this.stop();
            setTimeout(() => {
                this.play();
            }, 0);
        }
    }

    timeSince(timeStamp) {
        return this._datetimeUtils.timeSinceFromTemplateRenderTime(timeStamp, this.templateRenderTime)
    }

    private openForkDialogue() {
        $('#forkModal').openModal();
    }

    private forkComposition(id: number) {
        var self = this;
        this._editorService.forkComposition(this.selectedVersion, id).subscribe(response => {
            self.closeModal();
            self._router.navigate(['Editor', {id: response.destination_composition.id}])
        })
    }

    private revertComposition() {
        this._parseComposition(this.composition.latest_version.tracks);
        this.sendTrackDiff('');
    }

    private showCommit(commit: any) {
        this._parseComposition(commit.tracks);
    }

    private sendTrackDiff(tracks: any) {
        var self = this;
        var data = {
            tracks: []
        };
        console.log(self.trackListID);
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
                            soundName: ''
                        });
                    }
                });
                track_list.push({soundList: sector_list});
            });
            self.trackList.push({
                id: self.trackListID.length - 1,
                instrument: self.instrumentMapID[track.instrument],
                sectorList: track_list,
                volume: 100
            });
        });
    }

    private _onSocketMessageHandler(event: MessageEvent, context: any) {
        var self = context;
        var message = JSON.parse(event.data);
        switch (message.method) {
            case 'sign_in': {
                self.diffID = message.data.id;
                self._parseComposition(message.data.tracks);
                break;
            }
            case 'diff': {
                self.diffID = message.data.id;
                self._parseComposition(message.data.tracks);
                break;
            }
            case 'history_down': {
                if (message.status == 200) {
                    Materialize.toast('Redo', 1500);
                    self.diffID = message.data.id;
                    self._parseComposition(message.data.tracks);
                } else if (message.status == 404) {
                    Materialize.toast(message.data.detail, 1500)
                } else {
                    Materialize.toast('Oops, something went wrong', 1500)
                }
                break;
            }
            case 'history_up': {
                if (message.status == 200) {
                    Materialize.toast('Undo', 1500);
                    self.diffID = message.data.id;
                    self._parseComposition(message.data.tracks);
                } else if (message.status == 404) {
                    Materialize.toast(message.data.detail, 1500)
                } else {
                    Materialize.toast('Oops, something went wrong', 1500)
                }
                break;
            }
            case 'commit': {
                if (message.status == 201) {
                    Materialize.toast('Commit successful', 1500);
                    self.templateRenderTime = new Date();
                    self._editorService.getCommits(self.id).subscribe(commits => {
                        self.commits = commits.results;
                    })
                } else {
                    Materialize.toast(message.data.detail[0], 1500)
                }
                break;
            }
        }
    }

    private static _createEmptyTrack() {
        let emptySectorList = [];
        for (let i = 0; i < 32; i++) {
            emptySectorList.push({
                name: 'empty',
                soundName: ''
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
            instrument.sounds.forEach(function (sound) {
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

    public browserValidate() {
        let isChrome = this.checkBrowser().indexOf('Chrome') != -1;
        if (!isChrome) {
            // alert('Please for stability work use browser Google Chrome')
            setTimeout(() => {
                $('#chromeError').openModal();
            }, 0)
        }
    }
    private checkBrowser() {
        var ua= navigator.userAgent, tem,
            M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if(/trident/i.test(M[1])){
            tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
            return 'IE '+(tem[1] || '');
        }
        if(M[1]=== 'Chrome'){
            tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
            if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
        }
        M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
        if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
        return M.join(' ');
    }

    public closeModalBrowser() {
        $('#chromeError').closeModal();
    }
}
