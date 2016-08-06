import {Component, OnInit} from "angular2/core";
import {UserListComponent} from "./user/list/user-list.component";
import {UserCardComponent} from "./user/user-card.component";
import {BandListComponent} from "./band/band-list.component";
import {BandDetailComponent} from "./band/band-detail.component";
import {RouteConfig, ROUTER_DIRECTIVES, Router} from "angular2/router";
import {EditorComponent} from "./editor/editor.component";
import {LoginComponent} from "./auth/login.component";
import {RegisterComponent} from "./auth/register.component";
import {AuthService} from "./auth/auth.service";
import {NavBarComponent} from "./components/nav-bar.component";
import {PageTitleComponent} from "./components/page-title.component";
import {BandCreateComponent} from "./band/band-create.component";

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
@RouteConfig([
    {path:'/users', name: 'UserList', component: UserListComponent},
    {path:'/users/:id', name: 'UserDetail', component: UserCardComponent},
    {path:'/bands', name: 'BandList', component: BandListComponent},
    {path:'/bands/create/', name: 'BandCreate', component: BandCreateComponent},
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
