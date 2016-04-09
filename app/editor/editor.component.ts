import {Component, OnInit} from 'angular2/core';
import {Router} from "angular2/router";
import {AuthService} from "../auth/auth.service";
import {Instrument} from "./instrument.model";
import {EditorService} from "./editor.service";
import {Track} from "./track.model";

@Component({
    selector: 'editor',
    providers: [EditorService],
    templateUrl: '/app/editor/editor.component.html',
    styleUrls: ['app/editor/editor.component.css', 'app/editor/material-indigo-pink.css'],
})
export class EditorComponent implements OnInit {
    public instrumentList: Instrument[];
    public trackList: Track[];

    private emptySectorList = [];

    constructor(private _router: Router, private _authService: AuthService, private _editorService: EditorService) {
        var self = this;
        this._authService.isAuth().then(function(isAuth) {
            if (!isAuth) {
                self._router.navigate(['Login']);
            }
        });

        self.trackList = [];
    };

    ngOnInit() {
        var self = this;
        for (let i = 0; i < 32; i++) {
            this.emptySectorList.push('empty');
        }

        this._editorService.getInstrumentList()
            .then(instrumentList => {
                self.instrumentList = instrumentList;
                self.trackList.push({
                    id: 1,
                    instrument: self.instrumentList[0],
                    sectorList: self.emptySectorList.slice() // slice это как clone для массивов
                });
                console.log(self.trackList);
            });
    }

    changeActiveInstrument(instrument: Instrument) {
        for(let instrumentItem of this.instrumentList) {
            instrumentItem.active = false;
        }

        instrument.active = true;
    }

    createTrack() {
        this.trackList.push({
            id: this.trackList[this.trackList.length - 1].id + 1,
            instrument: this.instrumentList.filter(item => item.active)[0],
            sectorList: this.emptySectorList.slice()
        })
    }

    mappingSoundValToType(string) {
        let mapper = {
            hi: 'type-1',
            mid: 'type-2',
            lo: 'type-3'
        };
        return mapper[string] ? mapper[string] : string;
    }
}
