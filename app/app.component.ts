import {Component, OnInit} from 'angular2/core';
import {UserListComponent} from './user/user-list.component';
import {UserCardComponent} from './user/user-card.component';
import {BandListComponent} from './band/band-list.component';
import {BandDetailComponent} from './band/band-detail.component';
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
        <nav-bar>
            *ngIf="_pageTitle != '' && _pageTitle != 'register'"
            [routeName]="_pageTitle"
        </nav-bar>
        <div id="wrapper">
            <div id="page-wrapper">
                <div class="container-fluid">
              
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
    {path:'/users', name: 'UserList', component: UserListComponent},
    {path:'/users/:id', name: 'UserDetail', component: UserCardComponent},
    {path:'/bands', name: 'BandList', component: BandListComponent},
    {path:'/bands/:id', name: 'BandDetail', component: BandDetailComponent},
    {path:'/composition/:id', name: 'Editor', component: EditorComponent},
    {path:'/settings', name: 'Settings', component: EditorComponent},
    {path:'/', name: 'Login', component: LoginComponent },
    {path:'/register', name: 'Register', component: RegisterComponent}
])
export class AppComponent implements OnInit {
    
    private _pageTitle: string;
    
    constructor(private _authService: AuthService, private _router: Router) {
        _router.subscribe((val) => this._pageTitle = val); 
    }

    ngOnInit() {

    }

}
