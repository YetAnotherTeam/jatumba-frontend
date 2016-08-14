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
    
    private _first_name = "";
    
    private _last_name = "";

    private username_error;

    public selectedUser = "";


    constructor(private _authService: AuthService, private _router: Router) {
        var self = this;
        this._authService.isAuth().then((isAuth) =>  {
            if (isAuth) {
                this._authService.getUser().then((user) => {
                    this._router.navigate(['UserDetail', {id: user.id}])
                })
            }
        }).catch(()=>{})
    }

    register() {
        let self = this;
        this._authService.register(this._login, this._first_name, this._last_name, this._password,
            () => {
                this._authService.getUser().then((user) => {
                    this._router.navigate(['UserDetail', {id: user.id}])
                })
            },
            (error) => {
                if (error.username) {
                    this.username_error = error.username[0];
                }
            }
        )
    }

    ngOnInit(){}

}
