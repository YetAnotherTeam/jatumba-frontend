import {Component} from 'angular2/core';
import {UserCardComponent} from './user-card.component';

@Component({
    selector: 'user-list',
    template: `
    <div>
        <div *ngFor="#user of userList">
            <div style="color: blue;"
            (click)="onSelect(user)"
            [class.hidden]="selectedUser == user"
            >
            {{user.name}} {{user.lastname}}
            </div>
            <user-card
            [user]="selectedUser"
            [class.hidden]="selectedUser != user"
            ></user-card>
        </div>


    </div>
    `,
    directives: [UserCardComponent]
})
export class UserListComponent {
    public userList = [{
        name: "ХаБоЗа",
        lastname: "СаБрНд",
        profession: "Балабол, Бекенд, android",
        phone: "+7(000)018-23-16",
        email: "jatumba@pro.ru"
    }, {
        name: "ХаБоЗа",
        lastname: "СаБрНд",
        proffesion: "Балабол, Бекенд, android",
        phone: "+7(000)018-23-16",
        email: "jatumba@pro.ru"
    }, {
        name: "ХаБоЗа",
        lastname: "СаБрНд",
        proffesion: "Балабол, Бекенд, android",
        phone: "+7(000)018-23-16",
        email: "jatumba@pro.ru"
    }];

    public selectedUser = "";

    onSelect(user) {
        this.selectedUser = user;
    }
}
