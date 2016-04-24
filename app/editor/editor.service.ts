import {Injectable} from 'angular2/core'
import {INSTRUMENT_LIST} from "./mock-instrument-list";
import {Headers, Http} from "angular2/http";
import {$WebSocket} from "./websocket"

@Injectable()
export class EditorService {
    getInstrumentList() {
        return Promise.resolve(INSTRUMENT_LIST);
    }
}

@Injectable()
export class EditorSocketService {
    private _headers: Headers;

    private href = "ws://p30112.lab1.stud.tech-mail.ru/ws/composition/1/";

    //private href = "http://localhost:8888/api/";
    private _auth: boolean = false;
    private socket;



    constructor(private _http: Http) {
        this._headers = new Headers();
        this._headers.append('Content-Type', 'application/json');
        this.socket = new $WebSocket(this.href);
        while (!this.socket.getReadyState()) {}
    }

    send(message: string) {
        this.socket.send(message)
    }
    
    static setOnMessageHandler(f: any, socket: any) {
        socket.onMessage(f, this);
    }
    
    getSocket() {
        return this.socket;
    }

    socketSignIn() {
        var data = {
            access_token: localStorage.getItem('access_token')
        };
        this.socket.send(EditorSocketService.createMessage("sign_in", data));
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