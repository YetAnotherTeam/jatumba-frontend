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
var BandListComponent = (function () {
    function BandListComponent(_bandService, _router, _authService) {
        this._bandService = _bandService;
        this._router = _router;
        this._authService = _authService;
        var self = this;
        this._authService.isAuth().then(function (isAuth) {
            if (!isAuth) {
                self._router.navigate(['Login']);
            }
        });
    }
    BandListComponent.prototype.list = function () {
        var _this = this;
        this._bandService.list().subscribe(function (bandList) { return _this.bandList = bandList; });
    };
    BandListComponent.prototype.ngOnInit = function () {
        this.list();
    };
    BandListComponent = __decorate([
        core_1.Component({
            selector: 'band-list',
            template: "\n<main>\n<div class=\"container\">\n<div class=\"row\">\n<div class=\"col s12 m9 l10\">\n<div class=\"collection\">\n    <div>\n\n        <div *ngFor=\"#band of bandList\">\n            <a class=\"collection-item\" [routerLink]=\"['BandDetail', {'id': band.id}]\">\n                <strong>{{band.name}}</strong> <br>\n            </a>\n             <p>\n                    {{band.description}}\n             </p>\n        </div>\n    </div>\n\n</div>\n</div>\n</div>\n</div>\n</main>\n    ",
            directives: [router_1.ROUTER_DIRECTIVES],
            providers: [band_service_1.BandService]
        })
    ], BandListComponent);
    return BandListComponent;
}());
exports.BandListComponent = BandListComponent;
//# sourceMappingURL=band-list.component.js.map