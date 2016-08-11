import {AppComponent} from "../app.component";
import {Injectable} from "angular2/core";
import {Http, Headers} from "angular2/http";
import {User} from "../user/user";
import {BaseAPIService} from "../base/base.api.service";
import {Observable} from "rxjs/Observable";

@Injectable()
export class AuthService extends BaseAPIService {
    private _auth: boolean = false;

    constructor(private _http: Http) {
        super();
    }

    register(username: string, first_name: string, last_name: string, password: string, callback, callbackError) {
        var register_headers = new Headers();
        register_headers.append('Content-Type', 'multipart/form-data');
        var headers = {headers: register_headers};
        let formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        formData.append('first_name', first_name);
        formData.append('last_name', last_name);
        $.ajax({
            url: this.baseAPIUrl + 'user/sign_up/',
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            type: 'POST',
            success: (data) => {
                this._auth = true;
                localStorage.setItem('access_token', data['session']['access_token']);
                localStorage.setItem('refresh_token', data['session']['refresh_token']);
                localStorage.setItem('user', JSON.stringify(data['user']));
                callback(data);
            },
            error: (jhr) => {
                callbackError(jhr.responseJSON);
            }
        });
        // return this._http.post(this.baseAPIUrl + 'user/sign_up/', JSON.stringify({
        //     username: username,
        //     password: password
        // }), headers)
        //     .map(res => res.json())
        //     .do(data => {
        //             this._auth = true;
        //             localStorage.setItem('access_token', data['session']['access_token']);
        //             localStorage.setItem('refresh_token', data['session']['refresh_token']);
        //             localStorage.setItem('user', JSON.stringify(data['user']));
        //             return data;
        //         },
        //         error => {
        //             return {'error': error['username']}
        //         }
        //     )
    }

    login(username: string, password: string) {
        return this._http.post(this.baseAPIUrl + 'user/sign_in/', JSON.stringify({
            username: username,
            password: password
        }), this.getHeaders())
            .map(res => res.json())
            .do(data => {
                    console.log('data', data);
                    this._auth = true;
                    localStorage.setItem('access_token', data['session']['access_token']);
                    localStorage.setItem('refresh_token', data['session']['refresh_token']);
                    localStorage.setItem('user', JSON.stringify(data['user']));
                    return data;
                },
                error => {
                    return error.json();
                }
            ).catch(error => {
                let errorObject = JSON.parse(error._body);
                return Observable.throw(errorObject);
            });
    }

    vkAuth(token: string, username?: string) {
        return this._http.post(this.baseAPIUrl + 'sign_up/vk/', JSON.stringify({
            token: token,
            username: username
        }), this.getHeaders())
            .map(res => res.json())
            .do(data => {
                    console.log('data', data);
                    this._auth = true;
                    localStorage.setItem('access_token', data['session']['access_token']);
                    localStorage.setItem('refresh_token', data['session']['refresh_token']);
                    localStorage.setItem('user', JSON.stringify(data['user']));
                    return data;
                }
            )
    }

    fbAuth(token: string, username?: string) {
        return this._http.post(this.baseAPIUrl + 'sign_up/fb/', JSON.stringify({
            token: token,
            username: username
        }), this.getHeaders())
            .map(res => res.json())
            .do(data => {
                    console.log('data', data);
                    this._auth = true;
                    localStorage.setItem('access_token', data['session']['access_token']);
                    localStorage.setItem('refresh_token', data['session']['refresh_token']);
                    localStorage.setItem('user', JSON.stringify(data['user']));
                    return data;
                },
                error => {
                    return error
                }
            )
    }

    isAuth() {
        var self = this;
        return new Promise(function (resolve, reject) {
            self._http.post(self.baseAPIUrl + 'user/is_authenticated/', JSON.stringify({
                access_token: localStorage.getItem('access_token'),
            }), self.getHeaders())
                .map(res => res.json())
                .do(data => {
                    self._auth = true;
                    localStorage.setItem('user', JSON.stringify(data['user']));
                    return data;
                })
                .subscribe(
                    (res) => resolve(res),
                    (err) => reject(err)
                )
        })

    }

    getUser(): Promise<User> {
        return this.isAuth().then(function () {
            return JSON.parse(localStorage.getItem('user'))
        })
    }
}