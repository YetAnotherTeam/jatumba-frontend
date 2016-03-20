import {Component, OnInit} from 'angular2/core';
import {UserCardComponent} from './user-card.component';
import {UserService} from "./user.service";
import {User} from "./user";

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
    directives: [UserCardComponent],
    providers: [UserService]
})
export class UserListComponent implements OnInit {
    public userList: User[];

    public selectedUser = "";

    constructor(private _userService: UserService) {}

    onSelect(user) {
        this.selectedUser = user;
    }

    getUserList() {
        this._userService.getUserList().then((userList: User[]) => this.userList = userList)
    }

    ngOnInit():any {
        this.getUserList();
    }

}
