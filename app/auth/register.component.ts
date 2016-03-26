import {Component, OnInit} from 'angular2/core';
import {ROUTER_DIRECTIVES} from "angular2/router";
import {AuthService} from "./auth.service";
import 'rxjs/Rx';
import {Http, ConnectionBackend} from "angular2/http";
@Component({
    selector: 'login',
    template: `
<h2>Регистрация</h2>

    <button [routerLink]="['Login']">Назад</button> <!-- Не нашел способа сделать Router.back()-->
    <form>
        <div>
            <label for="login">Логин</label>
            <input type="text" id="login" name="login" [(ngModel)]="_login">
        </div>
        <div>
            <label for="password">Пароль</label>
            <input type="text" id="password" name="password" [(ngModel)]="_password">
        </div>
        <button (click)="register()">Зарегистрироваться</button>
    </form> 
   `,
    directives: [ROUTER_DIRECTIVES],
    providers: [AuthService]
})
export class RegisterComponent implements OnInit {

    private _login = "";

    private _password = "";

    public selectedUser = "";

    constructor(private _authService: AuthService) {
    }

    register() {
        let self = this;
        this._authService.register(this._login, this._password).subscribe(function(data){
            localStorage.setItem('access_token', data['session']['access_token']);
            localStorage.setItem('refresh_token', data['session']['refresh_token']);
            self._authService.auth = true;
        });
    }

    ngOnInit() {

    }

}
