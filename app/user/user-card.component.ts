import {Component, OnInit, NgZone} from "angular2/core";
import {User} from "./user";
import {UserService} from "./user.service";
import {Router, RouteParams, ROUTER_DIRECTIVES} from "angular2/router";
import {AuthService} from "../auth/auth.service";
import {Composition} from "../band/composition";
import {DatetimeUtils} from "../utils/datetime";


@Component({
    selector: 'user-card',
    templateUrl: 'app/user/user.component.html',
    styleUrls: ['app/user/user.component.css'],
    directives: [ROUTER_DIRECTIVES],
    providers: [UserService, DatetimeUtils]
})

export class UserCardComponent implements OnInit {
    id: number;
    user: User;
    compositions: Composition[];

    private isCanEdit: boolean;
    private tab: string;

    private isEditModeOn = false;
    private templateRenderTime;

    constructor(private _userService: UserService,
                private _router: Router,
                private _authService: AuthService,
                private _datetimeUtils: DatetimeUtils,
                params: RouteParams,
                private _ngZone: NgZone) {
        var self = this;
        console.log('1');
        this._authService.isAuth().then((isAuth) => {
            console.log('2');
            if (!isAuth) {
                console.log('3');
                this._router.navigate(['Login']);
            }
        }).catch((err) => {
            console.log('4');
            this._router.navigate(['Login']);
        });
        console.log('5');
        this.id = +params.get('id');

        var system_user = JSON.parse(localStorage.getItem('user'));
        this.isCanEdit = system_user.id == this.id;
        this.tab = 'info';
        this.templateRenderTime = new Date();
        this.get_user();
    }

    private get_user() {
        this._userService.get(this.id).subscribe((user: any) => {
            this._ngZone.run(() => {
                this.compositions = user.compositions;
                delete user.compositions;
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
        this._userService.update(this.user).subscribe(user=> {
            self.user = user;
        });
    }

    changeTab(tab_name: string) {
        switch (tab_name) {
            case 'info': {
                this.tab = 'info';
                break;
            }
            case 'bands': {
                this.tab = 'bands';
                break;
            }
            case 'compositions': {
                this.tab = 'compositions';
                break;
            }
        }
    }

    timeSince(timeStamp) {
        return this._datetimeUtils.timeSinceFromTemplateRenderTime(timeStamp, this.templateRenderTime)
    }

    ngOnInit(): any {
        this.get_user();
    }
}