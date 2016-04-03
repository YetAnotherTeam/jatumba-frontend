import {Component, OnInit} from 'angular2/core';
import {ROUTER_DIRECTIVES, Router} from "angular2/router";
import {AuthService} from "./auth.service";
import {AppComponent} from "../app.component";
@Component({
    selector: 'login',
    templateUrl: '/app/auth/login.component.html',
    styleUrls: ['app/auth/login-register.component.css'],
    directives: [ROUTER_DIRECTIVES],
    providers: [AuthService],
})
export class LoginComponent implements OnInit {

    private _login = "";

    private _password = "";

    constructor(private _authService: AuthService, private _router: Router) {
        var self = this;
        this._authService.isAuth().then(function(isAuth) {
            if (isAuth) {
                self._router.navigate(['UserList'])
            }
        })
    }

    ngOnInit() {

    }

    login() {
        let self = this;
        this._authService.login(this._login, this._password).subscribe(function() {
            self._router.navigate(['UserList'])
        });
    }


}
