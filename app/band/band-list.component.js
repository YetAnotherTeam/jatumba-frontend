System.register(['angular2/core', "./band.service", "angular2/router", "../auth/auth.service"], function(exports_1, context_1) {
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
    var core_1, band_service_1, router_1, auth_service_1;
    var BandListComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (band_service_1_1) {
                band_service_1 = band_service_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (auth_service_1_1) {
                auth_service_1 = auth_service_1_1;
            }],
        execute: function() {
            BandListComponent = (function () {
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
                        template: "\n<main>\n<div class=\"container\">\n<div class=\"row\">\n<div class=\"col s12 m9 l10\">\n<div class=\"collection\">\n    <div>\n\n        <div *ngFor=\"#band of bandList\">\n            <a class=\"collection-item\">\n                <strong>{{band.name}}</strong> <br>\n            </a>\n             <p>\n                    {{band.description}}\n             </p>\n        </div>\n    </div>\n\n</div>\n</div>\n</div>\n</div>\n</main>\n    ",
                        directives: [router_1.ROUTER_DIRECTIVES],
                        providers: [band_service_1.BandService]
                    }), 
                    __metadata('design:paramtypes', [band_service_1.BandService, router_1.Router, auth_service_1.AuthService])
                ], BandListComponent);
                return BandListComponent;
            }());
            exports_1("BandListComponent", BandListComponent);
        }
    }
});
//# sourceMappingURL=band-list.component.js.map