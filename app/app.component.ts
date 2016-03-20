import {Component} from 'angular2/core';
import {UserListComponent} from './user/user-list.component';
import {RouteConfig, ROUTER_DIRECTIVES} from "angular2/router";
import {User} from "./user/user";
import {EditorComponent} from "./editor/editor.component";

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
    {path:'/editor', name: 'Editor',       component: EditorComponent}
])
export class AppComponent {
    public headMenu = {
        editor : {
            name: "Редактор",
            url: "/editor"
        },
        settings : {
            name: "Настройки",
            url: "/settings"
        },
        authorization : {
            name: "Авторизация",
            url: "/login"
        },
        userList : {
            name: "Коллектив",
            url: "/user-list"
        }
    };
}
