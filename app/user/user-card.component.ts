import {Component, OnInit, NgZone} from 'angular2/core';
import {User} from './user'
import {UserService} from "./user.service";
import {Router, RouteParams, ROUTER_DIRECTIVES} from "angular2/router";
import {AuthService} from "../auth/auth.service";


@Component({
    selector: 'user-card',
    template: `
<h1>Профиль</h1>
{{user|json}}
    <div *ngIf="user && !isEditModeOn">
        <div>name: {{user.first_name}}</div>
        <div>lastname: {{user.last_name}}</div>
        <div>username: {{user.username}}</div>
        <div>vk: <a href="http://vk.com/id{{user.vk_profile}}">http://vk.com/id{{user.vk_profile}}</a></div>
        <div>fb: {{user.fb_profile}}</div>
        <div *ngFor="#member of user.members">
            <a class="collection-item" [routerLink]="['BandDetail', {'id': member.band.id}]">
                <strong>{{member.band.name}}</strong> <br>
            </a>
        </div>
    </div>
    <button 
        *ngIf="!isEditModeOn"
        (click)="changeEditMode(true)"
        >Редактировать</button>
    <div *ngIf="isEditModeOn">
        <div class="form-group">
            <label for="name">Name</label>
            <input type="text" class="form-control" required
            [(ngModel)]="user.first_name" >
        </div>
        <div class="form-group">
            <label for="name">Lastname</label>
            <input type="text" class="form-control" required
            [(ngModel)]="user.last_name" >
        </div>
        <div class="form-group">
            <label for="name">Username</label>
            <input type="text" class="form-control" required
            [(ngModel)]="user.username" >
        </div>
        <div class="form-group">
            <label for="name">VK (для ВК введите только id)</label>
            <input type="text" class="form-control" required
            [(ngModel)]="user.vk_profile" >
        </div>
        <div class="form-group">
            <label for="name">FB </label>
            <input type="text" class="form-control" required
            [(ngModel)]="user.fb_profile" >
        </div>
    </div>
    <button
        *ngIf="isEditModeOn"
        (click)="saveProfile()">Сохранить</button>
    `,
    directives: [ROUTER_DIRECTIVES],
    providers: [UserService]
})

export class UserCardComponent implements OnInit {
    id: number;
    user: User;
    
    private isCanEdit: boolean;

    private isEditModeOn = false;

    constructor(private _userService: UserService, private _router: Router, private _authService: AuthService, params: RouteParams, private _ngZone: NgZone) {
        var self = this;
        this._authService.isAuth().then(function(isAuth) {
            if (!isAuth) {
                self._router.navigate(['Login']);
            }
        });
        this.id = +params.get('id');
        
         this._authService.getUser().then(user => {
             self.isCanEdit = user.id == self.id;
         });
    }

    private get_user() {
        this._userService.get(this.id).subscribe((user: User) => {
            this._ngZone.run(() => {
                this.user = user;
            })
        });
    }

    public visible = false;

    changeEditMode(flag) {
        this.isEditModeOn = flag;
    }

    saveProfile() {
        var self = this;
        this.changeEditMode(false);
        this._userService.update(this.user).subscribe(user=>{self.user = user;});
    }
    ngOnInit():any {
        this.get_user();
    }
}