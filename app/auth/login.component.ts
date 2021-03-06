import {Component, OnInit, NgZone} from "angular2/core";
import {ROUTER_DIRECTIVES, Router} from "angular2/router";
import {AuthService} from "./auth.service";
@Component({
    selector: 'login',
    templateUrl: '/app/auth/login.component.html',
    styleUrls: ['app/auth/login-register.component.css'],
    directives: [ROUTER_DIRECTIVES],
    providers: [AuthService],
})
export class LoginComponent implements OnInit {
    private _login = "";

    private _password = "";

    private login_error = "";

    private social_username = "";

    private login_controller = {
        hide_login: false,
        show_fb_register: false,
        show_vk_register: false
    };


    constructor(private _authService: AuthService, private _router: Router, private _ngZone: NgZone) {
        var self = this;
        this._authService.isAuth().then((isAuth) => {
            if (isAuth) {
                this._authService.getUser().then((user) => {
                    this._router.navigate(['UserDetail', {id: user.id}])
                })
            }
        }).catch((err) => {});
    }

    ngOnInit() {
        hello.init({
                vk: '5406655',
                facebook: '214029838968901'
            },
            {
                redirect_uri: location.origin,
                force: true
            });
    }

    onVkAuthButton() {
        var scope = 'offline, email';

        hello('vk').login({
            response_type: 'token',
            scope: scope
        }, auth => this.onVkAuth(auth.authResponse.access_token));
    }

    onVkAuth(token: string) {
        let self = this;
        this._authService
            .vkAuth(token)
            .subscribe(
                account => {
                    self._router.navigate(['UserDetail', {id: account.user.id}])
                },
                e => {
                    if (e.status == 400) {
                        self.toggleSocialInput('vk');
                    }
                }
            )
    }

    onFbAuthButton() {
        var scope = 'email';

        hello('facebook').login({
            response_type: 'token',
            scope: scope
        }, auth => this.onFbAuth(auth.authResponse.access_token));
    }

    onFbAuth(token: string) {
        let self = this;
        this._authService
            .fbAuth(token)
            .subscribe(
                account => {
                    self._router.navigate(['UserDetail', {id: account.user.id}])
                },
                e => {
                    if (e.status == 400) {
                        self.toggleSocialInput('fb');
                    }
                }
            )
    }

    toggleSocialInput(provider: string) {
        this._ngZone.run(() => {
            this.login_controller.hide_login = true;
            if (provider == 'vk') {
                this.login_controller.show_vk_register = true;
            } else if (provider == 'fb') {
                this.login_controller.show_fb_register = true;
            }
        })
    }

    onVkRegisterButton() {
        let self = this;
        console.log('pre');
        var hello_object = JSON.parse(localStorage.getItem('hello'));
        var token = hello_object.vk.access_token;
        console.log('after');
        this._authService.vkAuth(token, this.social_username).subscribe(account =>
            self._router.navigate(['UserDetail', account.user.id]), e => {
            this.login_error = 'Ошибка при авторизации';
            if (e.status == 400) {
                self.login_error = "Имя пользователя уже занято";
            }
        })
    }

    onFbRegisterButton() {
        let self = this;
        var hello_object = JSON.parse(localStorage.getItem('hello'));
        var token = hello_object.facebook.access_token;
        this._authService.fbAuth(token, this.social_username).subscribe(account => self._router.navigate(['UserDetail', account.user.id]), e => {
            this.login_error = 'Ошибка при авторизации';
            if (e.status == 400) {
                self.login_error = "Имя пользователя уже занято";
            }
        })
    }

    login() {
        let self = this;
        this._authService.login(this._login, this._password).subscribe(function (data) {
                self._router.navigate(['UserDetail', {id: data.user.id}])
            }, (error) => {
                console.log('errorMSG', error);
                this.login_error = error.error;
            }
        );
    }
}
