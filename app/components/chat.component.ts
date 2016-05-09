import {Component} from 'angular2/core';
import {AuthService} from "../auth/auth.service";
import {ROUTER_DIRECTIVES} from "angular2/router"
import {Router} from "angular2/router";
import {ChatSocketService } from './chat.service'

@Component({
    selector: 'chat-component',
    templateUrl: '/app/components/chat.html',
    styleUrls: ['app/components/chat.component.css'],
    inputs: ['routeName', 'band_id'],
    directives: [ROUTER_DIRECTIVES],
    providers: [AuthService]
})

export class ChatComponent {
    public routeName : string;
    messages: string[];
    messageInput: string;
    band_id: number;

    public user = {};

    constructor(private _authService: AuthService, private _router: Router, private _service: ChatSocketService) {
        var self = this;
        this._authService.getUser().then(function(user) {
            self.user = user;
        });
        console.log('something');

        this.messages = [];
        this._service.start(this.band_id, this._onSocketMessageHandler, this);
    }

    sendMessage(event: any) {
        this._service.sendMessage(this.messageInput);
        this.setMessage(this.messageInput);
        this.messageInput = '';
    }

    setMessage(message: any) {
        if (this.messages.length > 20) {
            this.messages.shift();
        }
        this.messages.push(message);
    }

    setStartingMessages(messaage: any) {

    }

    private _onSocketMessageHandler(event: MessageEvent, context: any) {
        var self = context;
        var message = JSON.parse(event.data);
        switch (message.method) {
            case 'sign_in': {
                self.setStartingMessages(message.data);
                break;
            }
            case 'publish': {
                self.setMessage(message.data);
                break;
            }
        }
    }

}