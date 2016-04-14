"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('angular2/core');
var http_1 = require("angular2/http");
var BandService = (function () {
    function BandService(_http) {
        this._http = _http;
        this.href = "http://p30112.lab1.stud.tech-mail.ru/api/";
        this._headers = new http_1.Headers();
        this._headers.append('Content-Type', 'application/json');
        this._headers.append('token', localStorage.getItem('access_token'));
    }
    BandService.prototype.list = function () {
        return this._http.get(this.href + 'band/', this.getHeaders()).map(function (res) { return res.json(); });
    };
    BandService.prototype.get = function (id) {
        return this._http.get(this.href + 'band/' + id + '/', this.getHeaders()).map(function (res) { return res.json(); });
    };
    BandService.prototype.update = function (band) {
        return this._http.patch(this.href + 'band/' + band.id + '/', JSON.stringify({
            name: band.name,
            description: band.description
        }), this.getHeaders())
            .map(function (res) { return res.json(); });
    };
    BandService.prototype.join = function (band_id, instrument_id) {
        return this._http.post(this.href + 'member/', JSON.stringify({
            band: band_id,
            instrument: instrument_id
        }), this.getHeaders())
            .map(function (res) { return res.json(); });
    };
    BandService.prototype.members_list = function (band_id) {
        return this._http.get(this.href + 'member/?band=' + band_id, this.getHeaders()).map(function (res) { return res.json(); });
    };
    BandService.prototype.getHeaders = function () {
        return { headers: this._headers };
    };
    BandService = __decorate([
        core_1.Injectable()
    ], BandService);
    return BandService;
}());
exports.BandService = BandService;
//# sourceMappingURL=band.service.js.map