import {Component, OnInit} from 'angular2/core';
import {ROUTER_DIRECTIVES, Router} from "angular2/router";
import {AuthService} from "./auth.service";
import 'rxjs/Rx';
import {Http, ConnectionBackend} from "angular2/http";
@Component({
    selector: 'login',
    templateUrl: '/app/auth/register.component.html',
    styleUrls: ['app/auth/login-register.component.css'],
    directives: [ROUTER_DIRECTIVES],
    providers: [AuthService]
})
export class RegisterComponent implements OnInit {

    private _login = "";

    private _password = "";

    public selectedUser = "";

    constructor(private _authService: AuthService, private _router: Router) {
    }

    register() {
        let self = this;
        this._authService.register(this._login, this._password).add(function() {
            self._router.navigate(['UserList'])
        });
    }

    ngOnInit() {

    }

}
