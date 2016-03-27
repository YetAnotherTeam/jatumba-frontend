import {Component, OnInit} from 'angular2/core';
import {UserListComponent} from './user/user-list.component';
import {RouteConfig, ROUTER_DIRECTIVES, AuxRoute} from "angular2/router";
import {User} from "./user/user";
import {EditorComponent} from "./editor/editor.component";
import {LoginComponent} from "./auth/login.component";
import {RegisterComponent} from "./auth/register.component";
import {AuthService} from "./auth/auth.service";

@Component({
    selector: 'my-app',
    template: `
<!--*ngIf="AppComponent.isAuth"-->
       <header *ngIf="__isAuth">
        <nav>
            <!-- <div class="container"> -->
                <div class="nav-wrapper">
                    <!-- <a class="page-title">Users</a> -->
                    <form>
                    <div class="input-field">
                      <input id="search" type="search" required>
                      <label for="search"><i class="material-icons">search</i></label>
                      <i class="material-icons">close</i>
                    </div>
                  </form>
                </div>
            <!-- </div> -->
        </nav>
        <div class="container"><a href="#" data-activates="nav-mobile" class="button-collapse top-nav waves-effect waves-light circle hide-on-large-only"><i class="mdi-navigation-menu"></i></a></div>
          <ul id="nav-mobile" class="side-nav fixed">
            <!-- li class="logo"><a id="logo-container" href="#" class="brand-logo">
                <img src="logo.png" width="200px" height="200px"> -->
            <li class="center-align">JatTeam</li>
            <li class="bold"><a [routerLink]="['Editor']" class="waves-effect waves-teal">Tracks</a></li>
            <li class="bold active"><a [routerLink]="['UserList']" class="waves-effect waves-teal">Users</a></li>
            <!--<li class="bold"><a href="#bands" class="waves-effect waves-teal">Bands</a></li>-->
          </ul>
    </header>  
    <router-outlet></router-outlet>     
    `,
    directives: [ROUTER_DIRECTIVES],
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



    constructor(private _authService: AuthService) {
        this.__isAuth = false;
    }

    ngOnInit() {
        this._authService.isAuth();
        var self = this;
        setInterval(function(){
            self.__isAuth = AppComponent.isAuth
        },1000)
    }

}
