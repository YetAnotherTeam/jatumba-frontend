import {Component, OnInit} from 'angular2/core';
import {Router} from "angular2/router";
import {AuthService} from "../auth/auth.service";

@Component({
    selector: 'editor',
    templateUrl: '/app/editor/page-content.html',
})
export class EditorComponent {
    constructor(private _router: Router, private _authService: AuthService) {
        var self = this;
        this._authService.isAuth().then(function(isAuth) {
            if (!isAuth) {
                self._router.navigate(['Login']);
            }
        })
    }
}
