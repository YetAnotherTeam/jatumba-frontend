import {Component} from 'angular2/core';
import {AuthService} from "../auth/auth.service";
import {ROUTER_DIRECTIVES} from "angular2/router"
import {Router} from "angular2/router";

@Component({
    selector: 'nav-bar',
    templateUrl: '/app/components/nav-bar.html',
    inputs: ['routeName'],
    directives: [ROUTER_DIRECTIVES],
    providers: [AuthService]
})

export class NavBarComponent {
    public routeName : string;
    
    public user = {};

    constructor(private _authService: AuthService, private _router: Router) {
        var self = this;
        this._authService.getUser().then(function(user) {
            console.log('usr', user);
            self.user = user;
        })
    }

    private logout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        this._router.navigate(['Login']);

    }
}