"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('angular2/core');
var router_1 = require("angular2/router");
var auth_service_1 = require("./auth.service");
var LoginComponent = (function () {
    function LoginComponent(_authService, _router, _ngZone) {
        this._authService = _authService;
        this._router = _router;
        this._ngZone = _ngZone;
        this._login = "";
        this._password = "";
        this.login_error = "";
        this.social_username = "";
        this.login_controller = {
            hide_login: false,
            show_fb_register: false,
            show_vk_register: false
        };
        var self = this;
        this._authService.isAuth().then(function (isAuth) {
            if (isAuth) {
                self._router.navigate(['UserList']);
            }
        });
    }
    LoginComponent.prototype.ngOnInit = function () {
        hello.init({
            vk: '5406655',
            facebook: '214029838968901'
        }, {
            redirect_uri: 'http://localhost:3000/',
            force: true
        });
    };
    LoginComponent.prototype.onVkAuthButton = function () {
        var _this = this;
        var scope = 'offline, email';
        hello('vk').login({
            response_type: 'token',
            scope: scope
        }, function (auth) { return _this.onVkAuth(auth.authResponse.access_token); });
    };
    LoginComponent.prototype.onVkAuth = function (token) {
        var self = this;
        this._authService
            .vkAuth(token)
            .subscribe(function (account) {
            self._router.navigate(['UserList']);
        }, function (e) {
            if (e.status == 404) {
                self.toggleSocialInput('vk');
            }
        });
    };
    LoginComponent.prototype.onFbAuthButton = function () {
        var _this = this;
        var scope = 'email';
        hello('facebook').login({
            response_type: 'token',
            scope: scope
        }, function (auth) { return _this.onFbAuth(auth.authResponse.access_token); });
    };
    LoginComponent.prototype.onFbAuth = function (token) {
        var self = this;
        this._authService
            .fbAuth(token)
            .subscribe(function (account) {
            self._router.navigate(['UserList']);
        }, function (e) {
            if (e.status == 404) {
                self.toggleSocialInput('fb');
            }
        });
    };
    LoginComponent.prototype.toggleSocialInput = function (provider) {
        var _this = this;
        this._ngZone.run(function () {
            _this.login_controller.hide_login = true;
            if (provider == 'vk') {
                _this.login_controller.show_vk_register = true;
            }
            else if (provider == 'fb') {
                _this.login_controller.show_fb_register = true;
            }
        });
    };
    LoginComponent.prototype.onVkRegisterButton = function () {
        var _this = this;
        var self = this;
        console.log('pre');
        var hello_object = JSON.parse(localStorage.getItem('hello'));
        var token = hello_object.vk.access_token;
        console.log('after');
        this._authService.vkAuth(token, this.social_username).subscribe(function (account) { return self._router.navigate(['UserList']); }, function (e) {
            _this.login_error = 'Ошибка при авторизации';
            if (e.status == 400) {
                self.login_error = "Имя пользователя уже занято";
            }
        });
    };
    LoginComponent.prototype.onFbRegisterButton = function () {
        var _this = this;
        var self = this;
        var hello_object = JSON.parse(localStorage.getItem('hello'));
        var token = hello_object.facebook.access_token;
        this._authService.fbAuth(token, this.social_username).subscribe(function (account) { return self._router.navigate(['UserList']); }, function (e) {
            _this.login_error = 'Ошибка при авторизации';
            if (e.status == 400) {
                self.login_error = "Имя пользователя уже занято";
            }
        });
    };
    LoginComponent.prototype.login = function () {
        var self = this;
        this._authService.login(this._login, this._password).subscribe(function () {
            self._router.navigate(['UserList']);
        }, function (error) {
            this.login_error = error;
        });
    };
    LoginComponent = __decorate([
        core_1.Component({
            selector: 'login',
            templateUrl: '/app/auth/login.component.html',
            styleUrls: ['app/auth/login-register.component.css'],
            directives: [router_1.ROUTER_DIRECTIVES],
            providers: [auth_service_1.AuthService]
        })
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map