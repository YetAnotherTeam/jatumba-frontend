import {AuthService} from "./auth.service";
import 'rxjs/Rx';
import {Component, OnInit} from "@angular/core";
import {ROUTER_DIRECTIVES} from "@angular/router";
import {Router} from "@angular/router-deprecated";
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

    private username_error;

    public selectedUser = "";


    constructor(private _authService: AuthService, private _router: Router) {
        var self = this;
        this._authService.isAuth().then(function(isAuth) {
            if (isAuth) {
                self._router.navigate(['/users'])
            }
        })
    }

    register() {
        let self = this;
        this._authService.register(this._login, this._password).subscribe(function() {
            self._router.navigate(['/users'])
        }, function(error) {
            this.username_error = error;
        });
    }

    ngOnInit(){}

}
