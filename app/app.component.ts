import {Component} from 'angular2/core';
import {UserListComponent} from './user/user-list.component';
import {RouteConfig, ROUTER_DIRECTIVES} from "angular2/router";
import {User} from "./user/user";
import {EditorComponent} from "./editor/editor.component";
import {LoginComponent} from "./auth/login.component";
import {RegisterComponent} from "./auth/register.component";

@Component({
    selector: 'my-app',
    template: `
       <h1>JaTumba</h1>
      <nav>
        <a [routerLink]="['UserList']">Коллектив</a>
        <a [routerLink]="['Editor']">Редактор</a>
      </nav>
      <div>
        <router-outlet></router-outlet>
      </div>
    `,
    directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
    {path:'/user-list', name: 'UserList', component: UserListComponent},
    {path:'/editor', name: 'Editor', component: EditorComponent},
    {path:'/settings', name: 'Settings', component: EditorComponent},
    {path:'/login', name: 'Login', component: LoginComponent},
    {path:'/register', name: 'Register', component: RegisterComponent}
])
export class AppComponent {}
