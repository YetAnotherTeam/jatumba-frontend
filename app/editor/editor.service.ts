import {Injectable} from 'angular2/core'
import {INSTRUMENT_LIST} from "./mock-instrument-list";
import {Headers, Http} from "angular2/http";


@Injectable()
export class EditorService {
    getInstrumentList() {
        return Promise.resolve(INSTRUMENT_LIST);
    }
}

@Injectable()
export class EditorSocketService {
    private _headers: Headers;

    private href = "ws://p30112.lab1.stud.tech-mail.ru/ws/";

    //private href = "http://localhost:8888/api/";
    private _auth: boolean = false;
    private socket;



    constructor(private _http: Http) {
        this._headers = new Headers();
        this._headers.append('Content-Type', 'application/json');
        this.socket = new WebSocket(this.href);
    }

    send(message: string) {
        this.socket.send(message)
    }
}