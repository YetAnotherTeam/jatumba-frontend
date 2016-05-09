import {$WebSocket} from "../editor/websocket";
import {Injectable} from "angular2/core";


@Injectable()
export class ChatSocketService {

    private href = "ws://p30112.lab1.stud.tech-mail.ru/ws/chat/";

    //private href = "http://localhost:8888/api/";
    private socket;

    constructor() {}

    send(message: string) {
        this.socket.send(message)
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

        this.socket.send(ChatSocketService.createMessage("sign_in", data));
    }

    sendMessage(message: string) {
        var data = {
            text: message
        };
        
        this.socket.send(ChatSocketService.createMessage("publish", data));
    }

    static createMessage(method: string, data: any) {
        return {
            method: method,
            data: data
        }
    }
}
