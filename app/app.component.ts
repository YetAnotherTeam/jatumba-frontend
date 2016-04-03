import {Component, OnInit} from 'angular2/core';
import {UserListComponent} from './user/user-list.component';
import {RouteConfig, ROUTER_DIRECTIVES, AuxRoute, Router} from "angular2/router";
import {User} from "./user/user";
import {EditorComponent} from "./editor/editor.component";
import {LoginComponent} from "./auth/login.component";
import {RegisterComponent} from "./auth/register.component";
import {AuthService} from "./auth/auth.service";
import {NavBarComponent} from "./components/nav-bar.component";
import {PageTitleComponent} from "./components/page-title.component";

@Component({
    selector: 'my-app',
    template: `
        <nav-bar
            [routeName]="_pageTitle"></nav-bar>
        <div id="wrapper">
            <div id="page-wrapper">
                <div class="container-fluid">
                    <page-title
                        [title]="_pageTitle"></page-title>
                    <div class="row">
                        <router-outlet></router-outlet>
                     </div>
                </div>
            </div>
         </div>
    `,
    directives: [ROUTER_DIRECTIVES, NavBarComponent, PageTitleComponent],
    providers: [AuthService]
})
@RouteConfig([
    {path:'/user-list', name: 'UserList', component: UserListComponent},
    {path:'/editor', name: 'Editor', component: EditorComponent},
    {path:'/settings', name: 'Settings', component: EditorComponent},
    {path:'/', name: 'Login', component: LoginComponent },
    {path:'/register', name: 'Register', component: RegisterComponent}
])
export class AppComponent implements OnInit {
    static isAuth: boolean;

    private __isAuth: boolean;

    private _pageTitle: string;



    constructor(private _authService: AuthService, private _router: Router) {
        this.__isAuth = false;
        _router.subscribe((val) => this._pageTitle = val);

    }

    ngOnInit() {
        this._authService.isAuth();
        var self = this;
        setInterval(function(){
            self.__isAuth = AppComponent.isAuth
        },1000)
    }

}
