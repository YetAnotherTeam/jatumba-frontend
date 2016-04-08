import {Injectable} from 'angular2/core'
import {Http, Headers} from "angular2/http";
import {AppComponent} from "../app.component";

@Injectable()
export class AuthService {

    private _headers: Headers;

    private href = "http://p30112.lab1.stud.tech-mail.ru/api/";

    private _auth: boolean = false;



    constructor(private _http: Http) {
        this._headers = new Headers();
        this._headers.append('Content-Type', 'application/json');
    }

    register(username:string, password:string) {
        return this._http.post(this.href + 'user/sign_up/', JSON.stringify({
            username: username,
            password: password
        }), this.getHeaders())
            .map(res => res.json())
            .do(data => {
                this._auth = true;
                localStorage.setItem('access_token', data['session']['access_token']);
                localStorage.setItem('refresh_token', data['session']['refresh_token']);
                localStorage.setItem('user', JSON.stringify(data['user']));
                return data;
            },
            error => {
                return {'error': error['username']}
            }
        )
    }

    login(username:string, password:string) {
        return this._http.post(this.href + 'user/sign_in/', JSON.stringify({
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
            })
    }

    isAuth() {
        var self = this;
        return new Promise(function(resolve, reject) {
            self._http.post(self.href + 'token/is_auth', JSON.stringify({
                    access_token: localStorage.getItem('access_token'),
                }), self.getHeaders())
                .map(res => res.json())
                .do(data => {
                    self._auth = true;
                    localStorage.setItem('user', JSON.stringify(data['user']));
                    return data;
                })
                .toPromise().then( res => resolve(self._auth))
        })

    }

    getUser() {
        return this.isAuth().then(function(){
            return JSON.parse(localStorage.getItem('user'))
        })
    }


    private getHeaders() {
        return {headers: this._headers}
    }
}