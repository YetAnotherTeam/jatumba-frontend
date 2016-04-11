System.register(['angular2/core', "angular2/router", "../auth/auth.service"], function(exports_1, context_1) {
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
    var core_1, router_1, auth_service_1;
    var NavBarComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (auth_service_1_1) {
                auth_service_1 = auth_service_1_1;
            }],
        execute: function() {
            NavBarComponent = (function () {
                function NavBarComponent(_authService) {
                    this._authService = _authService;
                    this.user = {};
                    var self = this;
                    this._authService.getUser().then(function (user) {
                        console.log('usr', user);
                        self.user = user;
                    });
                }
                NavBarComponent = __decorate([
                    core_1.Component({
                        selector: 'nav-bar',
                        templateUrl: '/app/components/nav-bar.html',
                        inputs: ['routeName'],
                        directives: [router_1.ROUTER_DIRECTIVES],
                        providers: [auth_service_1.AuthService]
                    }), 
                    __metadata('design:paramtypes', [auth_service_1.AuthService])
                ], NavBarComponent);
                return NavBarComponent;
            }());
            exports_1("NavBarComponent", NavBarComponent);
        }
    }
});
//# sourceMappingURL=nav-bar.component.js.map