System.register(['angular2/core', "./mock-instrument-list", "angular2/http", "angular2-websocket/angular2-websocket"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, mock_instrument_list_1, http_1, angular2_websocket_1;
    var EditorService, EditorSocketService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (mock_instrument_list_1_1) {
                mock_instrument_list_1 = mock_instrument_list_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (angular2_websocket_1_1) {
                angular2_websocket_1 = angular2_websocket_1_1;
            }],
        execute: function() {
            EditorService = (function () {
                function EditorService() {
                }
                EditorService.prototype.getInstrumentList = function () {
                    return Promise.resolve(mock_instrument_list_1.INSTRUMENT_LIST);
                };
                EditorService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], EditorService);
                return EditorService;
            }());
            exports_1("EditorService", EditorService);
            EditorSocketService = (function () {
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
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], EditorSocketService);
                return EditorSocketService;
            }());
            exports_1("EditorSocketService", EditorSocketService);
        }
    }
});
//# sourceMappingURL=editor.service.js.map