import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from "angular2/router";
@Component({
    selector: 'nav-bar',
    templateUrl: '/app/components/nav-bar.html',
    inputs: ['routeName'],
    directives: [ROUTER_DIRECTIVES],
})

export class NavBarComponent {
    public routeName : string;
    
}