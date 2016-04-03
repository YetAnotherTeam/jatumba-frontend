import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from "angular2/router";
import {AuthService} from "../auth/auth.service";
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

    constructor(private _authService: AuthService) {
        var self = this;
        this._authService.getUser().then(function(user) {
            console.log('usr', user);
            self.user = user;
        })
    }
}