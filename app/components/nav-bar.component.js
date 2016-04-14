"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('angular2/core');
var auth_service_1 = require("../auth/auth.service");
var router_1 = require("angular2/router");
var NavBarComponent = (function () {
    function NavBarComponent(_authService, _router) {
        this._authService = _authService;
        this._router = _router;
        this.user = {};
        var self = this;
        this._authService.getUser().then(function (user) {
            console.log('usr', user);
            self.user = user;
        });
    }
    NavBarComponent.prototype.logout = function () {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        this._router.navigate(['Login']);
    };
    NavBarComponent = __decorate([
        core_1.Component({
            selector: 'nav-bar',
            templateUrl: '/app/components/nav-bar.html',
            inputs: ['routeName'],
            directives: [router_1.ROUTER_DIRECTIVES],
            providers: [auth_service_1.AuthService]
        })
    ], NavBarComponent);
    return NavBarComponent;
}());
exports.NavBarComponent = NavBarComponent;
//# sourceMappingURL=nav-bar.component.js.map