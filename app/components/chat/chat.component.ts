import {Component, Input, NgZone} from '@angular/core';
import {AuthService} from "../../auth/auth.service";
import {ROUTER_DIRECTIVES} from "@angular/router"
import {ChatSocketService } from './chat.service'
import {Band} from "../../band/band";
import {Message} from "./models/message";
import {Router} from "@angular/router-deprecated";

@Component({
    selector: 'chat-component',
    templateUrl: '/app/components/chat/chat.html',
    styleUrls: ['app/components/chat/chat.component.css'],
    directives: [ROUTER_DIRECTIVES],
    providers: [AuthService, ChatSocketService]
})

export class ChatComponent {
    public routeName : string;
    messages: any[];
    messageInput: string;
    @Input() band: Band;
    date: Date;
    isCollapseChat = true;
    public user = {};

    constructor(private _authService: AuthService, private _router: Router, private _service: ChatSocketService, private _ngZone: NgZone) {
        var self = this;
        this.date = new Date;
        this.date.setTime(Date.now());
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
        var message = new Message(message_data);
        if (this.messages.length > 20) {
            this.messages.shift();
        }
        this._ngZone.run(() => this.messages.push(message));
        console.log(this.messages);
    }

    toggleChat() {
        this.isCollapseChat = !this.isCollapseChat;
    }

    setStartingMessages(data: any) {
        var self = this;
        data.messages.slice(Math.max(data.messages.length - 20, 1)).forEach(function (message_data) {
                var message = new Message(message_data);
                self.messages.push(message);
        });
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