"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('angular2/core');
var http_1 = require("angular2/http");
var AuthService = (function () {
    function AuthService(_http) {
        this._http = _http;
        this.href = "http://p30112.lab1.stud.tech-mail.ru/api/";
        //private href = "http://localhost:8888/api/";
        this._auth = false;
        this._headers = new http_1.Headers();
        this._headers.append('Content-Type', 'application/json');
    }
    AuthService.prototype.register = function (username, password) {
        var _this = this;
        return this._http.post(this.href + 'user/sign_up/', JSON.stringify({
            username: username,
            password: password
        }), this.getHeaders())
            .map(function (res) { return res.json(); })
            .do(function (data) {
            _this._auth = true;
            localStorage.setItem('access_token', data['session']['access_token']);
            localStorage.setItem('refresh_token', data['session']['refresh_token']);
            localStorage.setItem('user', JSON.stringify(data['user']));
            return data;
        }, function (error) {
            return { 'error': error['username'] };
        });
    };
    AuthService.prototype.login = function (username, password) {
        var _this = this;
        return this._http.post(this.href + 'user/sign_in/', JSON.stringify({
            username: username,
            password: password
        }), this.getHeaders())
            .map(function (res) { return res.json(); })
            .do(function (data) {
            console.log('data', data);
            _this._auth = true;
            localStorage.setItem('access_token', data['session']['access_token']);
            localStorage.setItem('refresh_token', data['session']['refresh_token']);
            localStorage.setItem('user', JSON.stringify(data['user']));
            return data;
        }, function (error) {
            return error;
        });
    };
    AuthService.prototype.vkAuth = function (token, username) {
        var _this = this;
        return this._http.post(this.href + 'sign_up/vk/', JSON.stringify({
            token: token,
            username: username
        }), this.getHeaders())
            .map(function (res) { return res.json(); })
            .do(function (data) {
            console.log('data', data);
            _this._auth = true;
            localStorage.setItem('access_token', data['session']['access_token']);
            localStorage.setItem('refresh_token', data['session']['refresh_token']);
            localStorage.setItem('user', JSON.stringify(data['user']));
            return data;
        });
    };
    AuthService.prototype.fbAuth = function (token, username) {
        var _this = this;
        return this._http.post(this.href + 'sign_up/fb/', JSON.stringify({
            token: token,
            username: username
        }), this.getHeaders())
            .map(function (res) { return res.json(); })
            .do(function (data) {
            console.log('data', data);
            _this._auth = true;
            localStorage.setItem('access_token', data['session']['access_token']);
            localStorage.setItem('refresh_token', data['session']['refresh_token']);
            localStorage.setItem('user', JSON.stringify(data['user']));
            return data;
        }, function (error) {
            return error;
        });
    };
    AuthService.prototype.isAuth = function () {
        var self = this;
        return new Promise(function (resolve, reject) {
            self._http.post(self.href + 'token/is_auth', JSON.stringify({
                access_token: localStorage.getItem('access_token')
            }), self.getHeaders())
                .map(function (res) { return res.json(); })
                .do(function (data) {
                self._auth = true;
                localStorage.setItem('user', JSON.stringify(data['user']));
                return data;
            })
                .toPromise().then(function (res) { return resolve(self._auth); });
        });
    };
    AuthService.prototype.getUser = function () {
        return this.isAuth().then(function () {
            return JSON.parse(localStorage.getItem('user'));
        });
    };
    AuthService.prototype.getHeaders = function () {
        return { headers: this._headers };
    };
    AuthService = __decorate([
        core_1.Injectable()
    ], AuthService);
    return AuthService;
}());
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map