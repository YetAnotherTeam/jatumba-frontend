import {Injectable} from 'angular2/core'
import {INSTRUMENT_LIST} from "./mock-instrument-list";
import {Headers, Http} from "angular2/http";
import {$WebSocket} from "./websocket"

@Injectable()
export class EditorService {
    // getInstrumentList() {
    //     return Promise.resolve(INSTRUMENT_LIST);
    // }

    private _headers: Headers;

    private href = "http://p30112.lab1.stud.tech-mail.ru/api/";

    //private href = "http://localhost:8888/api/";
    private _auth: boolean = false;
    private socket;

    constructor(private _http: Http) {
        this._headers = new Headers();
        this._headers.append('Content-Type', 'application/json');
        this._headers.append('token', localStorage.getItem('access_token'));
    }

    get(composition_id: number) {
        return this._http.get(this.href + 'composition/'+ composition_id + '/', this.getHeaders())
            .map(res => res.json())
    }

    forkComposition(composition_id: number, band_id: number) {
        return this._http.post(this.href + 'fork/', JSON.stringify({
            composition: composition_id,
            band: band_id
        }), this.getHeaders())
            .map(res => res.json())
    }

    loadInstrumentList() {
        return this._http.get(this.href + 'instrument/', this.getHeaders())
            .map(res => res.json())
    }

    private getHeaders() {
        return {headers: this._headers}
    }
}

@Injectable()
export class EditorSocketService {
    private _headers: Headers;

    private href = "ws://p30112.lab1.stud.tech-mail.ru/ws/composition/";

    //private href = "http://localhost:8888/api/";
    private _auth: boolean = false;
    private socket;

    constructor() {}

    send(message: string) {
        if (this.socket) {
            this.socket.send(message)
        }
    }
    
    getSocket() {
        return this.socket;
    }

    start(id: number, f: any, context: any) {
        this.socket = new $WebSocket(this.href + id + '/');
        while (!this.socket.getReadyState()) {}
        
        this.socket.onMessage(f, context);
        
        var data = {
            access_token: localStorage.getItem('access_token')
        };
        this.socket.send(EditorSocketService.createMessage("sign_in", data));
    }

    stop() {
        this.socket.close();
    }

    sendCompositionDiff(data: any) {
        this.socket.send(EditorSocketService.createMessage("commit", data));
    }
    
    static createMessage(method: string, data: any) {
        return {
            method: method,
            data: data
        }
    }

}