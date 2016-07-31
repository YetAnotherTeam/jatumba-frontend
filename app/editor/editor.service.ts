import {Injectable} from "angular2/core";
import {Headers, Http} from "angular2/http";
import {$WebSocket} from "./websocket";
import {BaseAPIService} from "../base/base.api.service";

@Injectable()
export class EditorService extends BaseAPIService {
    private _auth: boolean = false;
    private socket;

    constructor(private _http: Http) {
        super();
        this._headers.append('token', localStorage.getItem('access_token'));
    }

    get(composition_id: number) {
        return this._http.get(this.baseAPIUrl + 'composition/' + composition_id + '/', this.getHeaders())
            .map(res => res.json())
    }

    forkComposition(composition_version_id: number, band_id: number) {
        return this._http.post(this.baseAPIUrl + 'fork/', JSON.stringify({
            source_composition_version: composition_version_id,
            band: band_id
        }), this.getHeaders())
            .map(res => res.json())
    }

    loadInstrumentList() {
        return this._http.get(this.baseAPIUrl + 'instrument/', this.getHeaders())
            .map(res => res.json())
    }

    getCommits(id: number) {
        return this._http.get(this.baseAPIUrl + 'composition_version/?composition=' + id, this.getHeaders())
            .map(res => res.json())
    }
}

@Injectable()
export class EditorSocketService {
    private _headers: Headers;

    private href = "ws://p30112.lab1.stud.tech-mail.ru/ws/composition/";

    //private href = "http://localhost:8888/api/";
    private _auth: boolean = false;
    private socket;

    constructor() {
    }

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
        while (!this.socket.getReadyState()) {
        }

        this.socket.onMessage(f, context);

        var data = {
            access_token: localStorage.getItem('access_token')
        };
        this.socket.send(EditorSocketService.createMessage("sign_in", data));
    }

    historyBack(id: number) {
        this.socket.send(EditorSocketService.createMessage('history_up', {diff_composition_version: id}));
    }

    historyForward(id: number) {
        this.socket.send(EditorSocketService.createMessage('history_down', {diff_composition_version: id}));
    }

    commit() {
        this.socket.send(EditorSocketService.createMessage('commit', {}))
    }

    stop() {
        this.socket.close();
    }

    sendCompositionDiff(data: any) {
        this.socket.send(EditorSocketService.createMessage("diff", data));
    }

    static createMessage(method: string, data: any) {
        return {
            method: method,
            data: data
        }
    }

}