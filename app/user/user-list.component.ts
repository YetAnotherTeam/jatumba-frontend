import {Component, OnInit} from 'angular2/core';
import {UserCardComponent} from './user-card.component';
import {UserService} from "./user.service";
import {User} from "./user";
import {Router, ROUTER_DIRECTIVES} from "angular2/router";
import {AppComponent} from "../app.component";
import {AuthService} from "../auth/auth.service";

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
            <a class="collection-item" [routerLink]="['UserDetail', {'id': user.id}]">
                <strong>{{user.username}}</strong> <br>
            </a>
             <p>
                    {{user.first_name}} {{user.last_name}}
             </p>

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
    directives: [UserCardComponent, ROUTER_DIRECTIVES],
    providers: [UserService]
})
export class UserListComponent implements OnInit {
    public userList: User[];

    public selectedUser = "";

    constructor(private _userService: UserService, private _router: Router, private _authService: AuthService) {
        var self = this;
        this._authService.isAuth().then(function(isAuth) {
            if (!isAuth) {
                self._router.navigate(['Login']);
            }
        })
    }

    onSelect(user) {
        this.selectedUser = user;
    }

    list() {
        this._userService.list().subscribe((userList: User[]) => this.userList = userList)
    }

    ngOnInit():any {
        this.list();
    }

}
