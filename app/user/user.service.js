"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('angular2/core');
var http_1 = require("angular2/http");
var UserService = (function () {
    function UserService(_http) {
        this._http = _http;
        this.href = "http://p30112.lab1.stud.tech-mail.ru/api/";
        this._headers = new http_1.Headers();
        this._headers.append('Content-Type', 'application/json');
        this._headers.append('token', localStorage.getItem('access_token'));
    }
    UserService.prototype.list = function () {
        return this._http.get(this.href + 'user/', this.getHeaders()).map(function (res) { return res.json(); });
    };
    UserService.prototype.get = function (id) {
        return this._http.get(this.href + 'user/' + id + '/', this.getHeaders()).map(function (res) { return res.json(); });
    };
    UserService.prototype.update = function (user) {
        return this._http.put(this.href + 'user/' + user.id + '/', JSON.stringify({
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            phone: user.phone
        }), this.getHeaders())
            .map(function (res) { return res.json(); });
    };
    UserService.prototype.getHeaders = function () {
        return { headers: this._headers };
    };
    UserService = __decorate([
        core_1.Injectable()
    ], UserService);
    return UserService;
}());
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map