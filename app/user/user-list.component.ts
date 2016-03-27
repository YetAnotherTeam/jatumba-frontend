import {Component, OnInit} from 'angular2/core';
import {UserCardComponent} from './user-card.component';
import {UserService} from "./user.service";
import {User} from "./user";
import {Router} from "angular2/router";
import {AppComponent} from "../app.component";

@Component({
    selector: 'user-list',
    template: `
<main>
<div class="container">
<div class="row">
<div class="col s12 m9 l10">
<div class="collection">
    <div>
        
        <div *ngFor="#user of userList">
            <a class="collection-item" href="#">
                <p>{{user.name}} <br>
                    {{user.lastname}}
                </p>
            </a>
            <!--<div style="color: blue;"-->
            <!--(click)="onSelect(user)"-->
            <!--[class.hidden]="selectedUser == user"-->
            <!--&gt;</div>-->
            <!--<user-card-->
            <!--[user]="selectedUser"-->
            <!--[class.hidden]="selectedUser != user"-->
            <!--&gt;</user-card>-->
        </div>
    </div>
    
</div>
</div>
</div>
</div>
</main>
    `,
    directives: [UserCardComponent],
    providers: [UserService]
})
export class UserListComponent implements OnInit {
    public userList: User[];

    public selectedUser = "";

    constructor(private _userService: UserService, private _router: Router) {}

    onSelect(user) {
        this.selectedUser = user;
    }

    getUserList() {
        this._userService.getUserList().then((userList: User[]) => this.userList = userList)
    }

    ngOnInit():any {
        if (!AppComponent.isAuth) {
            this._router.navigate(['Login']);
        }
        this.getUserList();
    }

}
