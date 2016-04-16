"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('angular2/core');
var mock_instrument_list_1 = require("./mock-instrument-list");
var http_1 = require("angular2/http");
var angular2_websocket_1 = require("angular2-websocket/angular2-websocket");
var EditorService = (function () {
    function EditorService() {
    }
    EditorService.prototype.getInstrumentList = function () {
        return Promise.resolve(mock_instrument_list_1.INSTRUMENT_LIST);
    };
    EditorService = __decorate([
        core_1.Injectable()
    ], EditorService);
    return EditorService;
}());
exports.EditorService = EditorService;
var EditorSocketService = (function () {
    function EditorSocketService(_http) {
        this._http = _http;
        this.href = "ws://p30112.lab1.stud.tech-mail.ru/ws/";
        //private href = "http://localhost:8888/api/";
        this._auth = false;
        this._headers = new http_1.Headers();
        this._headers.append('Content-Type', 'application/json');
        this.socket = new angular2_websocket_1.$WebSocket(this.href);
    }
    EditorSocketService.prototype.send = function (message) {
        this.socket.send(message);
    };
    EditorSocketService = __decorate([
        core_1.Injectable()
    ], EditorSocketService);
    return EditorSocketService;
}());
exports.EditorSocketService = EditorSocketService;
//# sourceMappingURL=editor.service.js.map