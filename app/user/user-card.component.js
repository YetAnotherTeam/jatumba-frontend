System.register(['angular2/core', "./user.service", "angular2/router", "../auth/auth.service"], function(exports_1, context_1) {
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
    var core_1, user_service_1, router_1, auth_service_1;
    var UserCardComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (user_service_1_1) {
                user_service_1 = user_service_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (auth_service_1_1) {
                auth_service_1 = auth_service_1_1;
            }],
        execute: function() {
            UserCardComponent = (function () {
                function UserCardComponent(_userService, _router, _authService, params, _ngZone) {
                    this._userService = _userService;
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
                UserCardComponent.prototype.get_user = function () {
                    var _this = this;
                    this._userService.get(this.id).subscribe(function (user) {
                        _this._ngZone.run(function () {
                            _this.user = user;
                        });
                    });
                };
                UserCardComponent.prototype.ngOnInit = function () {
                    this.get_user();
                };
                UserCardComponent = __decorate([
                    core_1.Component({
                        selector: 'user-card',
                        template: "\n    <div *ngIf=\"user\">\n        <div>name: {{user.first_name}}</div>\n        <div>lastname: {{user.last_name}}</div>\n        <div>username: {{user.username}}</div>\n        <div>vk: {{user.vk_profile}}</div>\n        <div>fb: {{user.fb_profile}}</div>\n    </div>\n    ",
                        providers: [user_service_1.UserService]
                    }), 
                    __metadata('design:paramtypes', [user_service_1.UserService, router_1.Router, auth_service_1.AuthService, router_1.RouteParams, core_1.NgZone])
                ], UserCardComponent);
                return UserCardComponent;
            }());
            exports_1("UserCardComponent", UserCardComponent);
        }
    }
});
//# sourceMappingURL=user-card.component.js.map