import {Component} from 'angular2/core';
@Component({
    selector: 'user-card',
    template: `
    <div>
        <div>name: {{user.name}}</div>
        <div>lastname: {{user.lastname}}</div>
        <div>profession: {{user.profession}}</div>
        <div>phone: {{user.phone}}</div>
        <div>email: {{user.email}}</div>
    </div>
    `,
    inputs: ["user", "visible"]
})

export class UserCardComponent {
    public user = {};
    public visible = false;
}