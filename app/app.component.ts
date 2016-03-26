import {Component, OnInit} from 'angular2/core';
import {UserListComponent} from './user/user-list.component';
import {RouteConfig, ROUTER_DIRECTIVES} from "angular2/router";
import {User} from "./user/user";
import {EditorComponent} from "./editor/editor.component";
import {LoginComponent} from "./auth/login.component";
import {RegisterComponent} from "./auth/register.component";
import {AuthService} from "./auth/auth.service";

@Component({
    selector: 'my-app',
    template: `
       <h1>JaTumba</h1>
      <nav>
        <a *ngIf="isAuth" [routerLink]="['UserList']">Коллектив</a>
        <a *ngIf="isAuth" [routerLink]="['Editor']">Редактор</a>
        <a *ngIf="!isAuth" [routerLink]="['Login']">Логин</a>
      </nav>
      <div>
        <router-outlet></router-outlet>
      </div>
    `,
    directives: [ROUTER_DIRECTIVES],
    providers: [AuthService]
})
@RouteConfig([
    {path:'/user-list', name: 'UserList', component: UserListComponent},
    {path:'/editor', name: 'Editor', component: EditorComponent},
    {path:'/settings', name: 'Settings', component: EditorComponent},
    {path:'/login', name: 'Login', component: LoginComponent},
    {path:'/register', name: 'Register', component: RegisterComponent}
])
export class AppComponent implements OnInit {
    static isAuth: boolean;

    constructor(private _authService: AuthService) {
    }

    ngOnInit() {
        // this._authService.auth.on()
        this._authService.isAuth();
    }

}
