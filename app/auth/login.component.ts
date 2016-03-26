import {Component, OnInit} from 'angular2/core';
import {ROUTER_DIRECTIVES} from "angular2/router";
import {AuthService} from "./auth.service";
@Component({
    selector: 'login',
    template: `
<h2>Авторизация</h2>
    <form>
        <div>
            <label for="login">Логин</label>
            <input type="text" id="login" name="login" [(ngModel)]="_login">
        </div>
        <div>
            <label for="password">Пароль</label>
            <input type="text" id="password" name="password" [(ngModel)]="_password">
        </div>
    </form>
    <button (click)="login()">Авторизоваться</button>
    <a [routerLink]="['Register']">Регистрация</a>
    `,
    directives: [ROUTER_DIRECTIVES],
    providers: [AuthService]
})
export class LoginComponent implements OnInit {

    private _login = "";

    private _password = "";

    constructor(private _authService: AuthService) {}

    ngOnInit() {}

    login() {
        this._authService.login(this._login, this._password).subscribe(function(data){
            localStorage.setItem('access_token', data['session']['access_token']);
            localStorage.setItem('refresh_token', data['session']['refresh_token']);
        });
    }


}
