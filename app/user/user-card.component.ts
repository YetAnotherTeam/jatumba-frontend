import {Component, OnInit, NgZone} from "angular2/core";
import {User} from "./user";
import {UserService} from "./user.service";
import {Router, RouteParams, ROUTER_DIRECTIVES} from "angular2/router";
import {AuthService} from "../auth/auth.service";
import {Composition} from "../band/composition";


@Component({
    selector: 'user-card',
    templateUrl: 'app/user/user.component.html',
    styleUrls: ['app/user/user.component.css'],
    directives: [ROUTER_DIRECTIVES],
    providers: [UserService]
})

export class UserCardComponent implements OnInit {
    id: number;
    user: User;
    compositions: Composition[];
    
    private isCanEdit: boolean;
    private tab: string;

    private isEditModeOn = false;

    constructor(private _userService: UserService, private _router: Router, private _authService: AuthService, params: RouteParams, private _ngZone: NgZone) {
        var self = this;
        this._authService.isAuth().then(function(isAuth) {
            if (!isAuth) {
                self._router.navigate(['Login']);
            }
        });
        this.id = +params.get('id');

        var system_user = JSON.parse(localStorage.getItem('user'));
        this.isCanEdit = system_user.id == this.id;
        this.tab = 'info';
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
        this._userService.update(this.user).subscribe(user=>{self.user = user;});
    }

    changeTab(tab_name: string) {
        switch(tab_name) {
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

    ngOnInit():any {
        this.get_user();
    }
}