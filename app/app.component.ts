import {Component} from 'angular2/core';
import {UserListComponent} from './user/user-list.component';

@Component({
    selector: 'my-app',
    template: `
    <user-list></user-list>
    `,
    directives: [UserListComponent]
})
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
