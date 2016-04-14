"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('angular2/core');
var user_service_1 = require("./user.service");
var UserCardComponent = (function () {
    function UserCardComponent(_userService, _router, _authService, params, _ngZone) {
        this._userService = _userService;
        this._router = _router;
        this._authService = _authService;
        this._ngZone = _ngZone;
        this.visible = false;
        var self = this;
        this._authService.isAuth().then(function (isAuth) {
            if (!isAuth) {
                self._router.navigate(['Login']);
            }
        });
        this.id = +params.get('id');
    }
    UserCardComponent.prototype.get_user = function () {
        var _this = this;
        this._userService.get(this.id).subscribe(function (user) {
            _this._ngZone.run(function () {
                _this.user = user;
            });
        });
    };
    UserCardComponent.prototype.ngOnInit = function () {
        this.get_user();
    };
    UserCardComponent = __decorate([
        core_1.Component({
            selector: 'user-card',
            template: "\n    <div *ngIf=\"user\">\n        <div>name: {{user.first_name}}</div>\n        <div>lastname: {{user.last_name}}</div>\n        <div>username: {{user.username}}</div>\n        <div>vk: <a href=\"http://vk.com/id{{user.vk_profile}}\">http://vk.com/id{{user.vk_profile}}</a></div>\n        <div>fb: {{user.fb_profile}}</div>\n    </div>\n    ",
            providers: [user_service_1.UserService]
        })
    ], UserCardComponent);
    return UserCardComponent;
}());
exports.UserCardComponent = UserCardComponent;
//# sourceMappingURL=user-card.component.js.map