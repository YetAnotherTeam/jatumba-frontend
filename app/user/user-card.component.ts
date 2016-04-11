import {Component, OnInit} from 'angular2/core';
import {User} from './user'
import {UserService} from "./user.service";
import {Router, RouteParams} from "angular2/router";
import {AuthService} from "../auth/auth.service";


@Component({
    selector: 'user-card',
    template: `
    <main>
    <div>
        <div>name: {{user.name}}</div>
        <div>lastname: {{user.lastname}}</div>
        <div>profession: {{user.profession}}</div>
        <div>phone: {{user.phone}}</div>
        <div>email: {{user.email}}</div>
    </div>
    </main>
    `,
    inputs: ["user", "visible"],
    providers: [UserService]
})

export class UserCardComponent implements OnInit {
    id: number;
    user: User;

    constructor(private _userService: UserService, private _router: Router, private _authService: AuthService, params: RouteParams) {
        var self = this;
        this._authService.isAuth().then(function(isAuth) {
            if (!isAuth) {
                self._router.navigate(['Login']);
            }
        });
        this.id = +params.get('id');
    }

    private get_user() {
        this._userService.get(this.id).subscribe((user: User) => this.user = user);
    }

    public visible = false;

    ngOnInit():any {
        this.get_user();
    }
}