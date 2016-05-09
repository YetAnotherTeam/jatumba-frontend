import {Component, Input, NgZone} from 'angular2/core';
import {AuthService} from "../auth/auth.service";
import {ROUTER_DIRECTIVES} from "angular2/router"
import {Router} from "angular2/router";
import {ChatSocketService } from './chat.service'
import {Band} from "../band/band";

@Component({
    selector: 'chat-component',
    templateUrl: '/app/components/chat.html',
    styleUrls: ['app/components/chat.component.css'],
    directives: [ROUTER_DIRECTIVES],
    providers: [AuthService, ChatSocketService]
})

export class ChatComponent {
    public routeName : string;
    messages: string[];
    messageInput: string;
    @Input() band: Band;

    public user = {};

    constructor(private _authService: AuthService, private _router: Router, private _service: ChatSocketService, private _ngZone: NgZone) {
        var self = this;
        this._authService.getUser().then(function(user) {
            self.user = user;
        });

        this.messages = [];

    }

    sendMessage(event: any) {
        this._service.sendMessage(this.messageInput);
        this.messageInput = '';
    }

    setMessage(message_data: any) {
        var message = message_data.author.username + ': ' + message_data.text;
        if (this.messages.length > 20) {
            this.messages.shift();
        }
        this._ngZone.run(() => this.messages.push(message));
        console.log(this.messages);
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

    ngOnInit():any {
        this._service.start(this.band.id, this._onSocketMessageHandler, this);
    }
}