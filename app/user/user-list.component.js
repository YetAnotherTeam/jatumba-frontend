"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('angular2/core');
var user_card_component_1 = require('./user-card.component');
var user_service_1 = require("./user.service");
var router_1 = require("angular2/router");
var UserListComponent = (function () {
    function UserListComponent(_userService, _router, _authService, _ngZone) {
        var _this = this;
        this._userService = _userService;
        this._router = _router;
        this._authService = _authService;
        this._ngZone = _ngZone;
        this.selectedUser = "";
        var self = this;
        this._ngZone.run(function () {
            _this._authService.isAuth().then(function (isAuth) {
                if (!isAuth) {
                    self._router.navigate(['Login']);
                }
                self.list();
            });
        });
    }
    UserListComponent.prototype.onSelect = function (user) {
        this.selectedUser = user;
    };
    UserListComponent.prototype.list = function () {
        var self = this;
        this._userService.list().subscribe(function (userList) {
            self._ngZone.run(function () { return self.userList = userList; });
        });
    };
    UserListComponent.prototype.ngOnInit = function () {
        this.list();
    };
    UserListComponent = __decorate([
        core_1.Component({
            selector: 'user-list',
            template: "\n<main>\n<div class=\"container\">\n<div class=\"row\">\n<div class=\"col s12 m9 l10\">\n<div class=\"collection\">\n    <div>\n        <div *ngFor=\"#user of userList\">\n            <a class=\"collection-item\" [routerLink]=\"['UserDetail', {'id': user.id}]\">\n                <strong>{{user.username}}</strong> <br>\n            </a>\n             <p>\n                    {{user.first_name}} {{user.last_name}}\n             </p>\n\n            <!--<div style=\"color: blue;\"-->\n            <!--(click)=\"onSelect(user)\"-->\n            <!--[class.hidden]=\"selectedUser == user\"-->\n            <!--&gt;</div>-->\n            <!--<user-card-->\n            <!--[user]=\"selectedUser\"-->\n            <!--[class.hidden]=\"selectedUser != user\"-->\n            <!--&gt;</user-card>-->\n        </div>\n    </div>\n    \n</div>\n</div>\n</div>\n</div>\n</main>\n    ",
            directives: [user_card_component_1.UserCardComponent, router_1.ROUTER_DIRECTIVES],
            providers: [user_service_1.UserService]
        })
    ], UserListComponent);
    return UserListComponent;
}());
exports.UserListComponent = UserListComponent;
//# sourceMappingURL=user-list.component.js.map