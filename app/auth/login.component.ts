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

    private login_error;

    constructor(private _authService: AuthService, private _router: Router) {
        var self = this;
        this._authService.isAuth().then(function(isAuth) {
            if (isAuth) {
                self._router.navigate(['UserList'])
            }
        })
    }

    ngOnInit() {
        hello.init({
                vk: '5406655'
            },
            {
                redirect_uri: 'http://localhost:3000/',
                force: true
            });
    }

    onVkAuthButton(provider: string) {
        var scope = 'offline, email';

        hello('vk').login({
            response_type: 'token',
            scope: scope
        }, auth => this.onSocialAuth(auth.network, auth.authResponse.access_token));
    }

    onSocialAuth(provider: string, token: string) {
        let self = this;
        this._authService
            .vkAuth(token)
            .subscribe(
                account => {
                    self._router.navigate(['UserList'])
            },
                e => this.login_error = 'Ошибка при авторизации'
        )
    }

    login() {
        let self = this;
        this._authService.login(this._login, this._password).subscribe(function() {
            self._router.navigate(['UserList'])
        }, function(error) {
                this.login_error = error;
            }
        );
    }


}
