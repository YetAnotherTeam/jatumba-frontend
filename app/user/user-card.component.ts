import {Component, OnInit, NgZone} from 'angular2/core';
import {User} from './user'
import {UserService} from "./user.service";
import {Router, RouteParams, ROUTER_DIRECTIVES} from "angular2/router";
import {AuthService} from "../auth/auth.service";


@Component({
    selector: 'user-card',
    template: `
<main>
<h1>Профиль</h1>
    <div *ngIf="user">
        <div>name: {{user.first_name}}</div>
        <div>lastname: {{user.last_name}}</div>
        <div>username: {{user.username}}</div>
        <div>vk: <a href="http://vk.com/id{{user.vk_profile}}">http://vk.com/id{{user.vk_profile}}</a></div>
        <div>fb: {{user.fb_profile}}</div>
        <div *ngFor="#member of user.members">
            <a class="collection-item" [routerLink]="['BandDetail', {'id': member.band.id}]">
                <strong>{{member.band.name}}</strong> <br>
            </a>
        </div>
    </div>
</main>
    `,
    directives: [ROUTER_DIRECTIVES],
    providers: [UserService]
})

export class UserCardComponent implements OnInit {
    id: number;
    user: User;

    constructor(private _userService: UserService, private _router: Router, private _authService: AuthService, params: RouteParams, private _ngZone: NgZone) {
        var self = this;
        this._authService.isAuth().then(function(isAuth) {
            if (!isAuth) {
                self._router.navigate(['Login']);
            }
        });
        this.id = +params.get('id');
    }

    private get_user() {
        this._userService.get(this.id).subscribe((user: User) => {
            this._ngZone.run(() => {
                this.user = user;
            })
        });
    }

    public visible = false;

    ngOnInit():any {
        this.get_user();
    }
}