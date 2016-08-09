import {Component, OnInit, NgZone} from "angular2/core";
import {UserCardComponent} from "../user-card.component";
import {UserService} from "../user.service";
import {User} from "../user";
import {Router, ROUTER_DIRECTIVES} from "angular2/router";
import {AuthService} from "../../auth/auth.service";

@Component({
    selector: 'user-list',
    templateUrl: '/app/user/list/user-list.component.html',
    directives: [UserCardComponent, ROUTER_DIRECTIVES],
    providers: [UserService]
})
export class UserListComponent implements OnInit {
    public userList: User[];

    public paginationInfo: any;
    public selectedUser = "";
    private searchInput: string;

    constructor(private _userService: UserService, private _router: Router, private _authService: AuthService, private _ngZone: NgZone) {
        var self = this;
        this._ngZone.run(() => {
            this._authService.isAuth().then((isAuth) => {
                if (!isAuth) {
                    this._router.navigate(['Login']);
                } else {
                    this.list();
                }
            }).catch((err) => {
                this._router.navigate(['Login']);
            });
        })
    }

    onSelect(user) {
        this.selectedUser = user;
    }

    list() {
        var self = this;
        this._userService.list().subscribe((userList: any) => {
                self._ngZone.run(() => {
                    self.userList = userList.results;
                    self.paginationInfo = userList
                })
            }
        )
    }

    searchUser(event: any) {
        this._userService.search(this.searchInput).subscribe((userList: any) => {
            this.userList = userList.results;
            this.paginationInfo = userList;
        });
    }

    ngOnInit(): any {
        this.list();
    }

}
