import {AuthService} from "./auth/auth.service";
import {NavBarComponent} from "./components/nav-bar.component";
import {PageTitleComponent} from "./components/page-title.component";
import {Component, OnInit} from "@angular/core";
import {ROUTER_DIRECTIVES} from "@angular/router";
import {Router} from "@angular/router-deprecated";

@Component({
    selector: 'my-app',
    template: `
        <div class="wrapper">
            <nav-bar
                *ngIf="_pageTitle != '' && _pageTitle != 'register'"
                [routeName]="_pageTitle">
            </nav-bar>
            <div class="main">
                <div class="row">
                    <router-outlet></router-outlet>
                </div>
             </div>
         </div>
    `,
    directives: [ROUTER_DIRECTIVES, NavBarComponent, PageTitleComponent],
    providers: [AuthService]
})
export class AppComponent implements OnInit {
    
    private _pageTitle: string;
    
    constructor(private _authService: AuthService, private _router: Router) {
        _router.subscribe((val) => this._pageTitle = val); 
    }

    ngOnInit() {

    }

}
