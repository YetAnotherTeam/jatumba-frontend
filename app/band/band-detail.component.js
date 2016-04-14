"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('angular2/core');
var band_service_1 = require("./band.service");
var router_1 = require("angular2/router");
var BandDetailComponent = (function () {
    function BandDetailComponent(_bandService, _router, _authService, params, _ngZone) {
        this._bandService = _bandService;
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
    BandDetailComponent.prototype.get_band_info = function () {
        var _this = this;
        this._bandService.get(this.id).subscribe(function (band) {
            _this._ngZone.run(function () {
                _this.band = band;
            });
        });
        this._bandService.members_list(this.id).subscribe(function (memberList) {
            _this._ngZone.run(function () {
                _this.memberList = memberList;
            });
        });
    };
    BandDetailComponent.prototype.onJoinButton = function () {
        var _this = this;
        var self = this;
        this._bandService.join(this.id).subscribe(function (data) { return _this._ngZone.run(function () {
            return self.get_band_info();
        }); });
    };
    BandDetailComponent.prototype.ngOnInit = function () {
        this.get_band_info();
    };
    BandDetailComponent = __decorate([
        core_1.Component({
            selector: 'band-card',
            template: "\n    <div *ngIf=\"band\">\n        <div>name: {{band.name}}</div>\n        <div>{{band.description}}</div>\n        <br>\n        <div *ngIf=\"memberList\">\n            <div *ngFor=\"#member of memberList\">\n                <a class=\"collection-item\" [routerLink]=\"['UserDetail', {'id': member.user.id}]\">\n                    <strong>{{member.user.username}}</strong> <br>\n                </a>\n                 <p>\n                        {{member.user.first_name}} {{member.user.last_name}} - {{member.instrument}}\n                 </p>\n            </div>\n        </div>\n        <div>\n            <button (click)=\"onJoinButton()\">\u041F\u0440\u0438\u0441\u043E\u0435\u0434\u0438\u043D\u0438\u0442\u044C\u0441\u044F</button>\n        </div>\n    </div>\n    ",
            providers: [band_service_1.BandService],
            directives: [router_1.ROUTER_DIRECTIVES]
        })
    ], BandDetailComponent);
    return BandDetailComponent;
}());
exports.BandDetailComponent = BandDetailComponent;
//# sourceMappingURL=band-detail.component.js.map