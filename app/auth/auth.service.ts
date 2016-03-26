import {Injectable} from 'angular2/core'
import {Http, Headers} from "angular2/http";
import {AppComponent} from "../app.component";

@Injectable()
export class AuthService {

    private _headers: Headers;

    private href = "http://p30112.lab1.stud.tech-mail.ru/api/";



    constructor(private _http: Http) {
        this._headers = new Headers();
        this._headers.append('Content-Type', 'application/json');
        AppComponent.isAuth = false;
    }

    register(username:string, password:string) {
        return this._http.post(this.href + 'user/sign_up/', JSON.stringify({
            username: username,
            password: password
        }), this.getHeaders())
            .map(res => res.json())
    }

    login(username:string, password:string) {
        return this._http.post(this.href + '/user/sign_up/', JSON.stringify({
                username: username,
                password: password
            }), this.getHeaders())
            .map(res => res.json())
    }

    isAuth() {
        AppComponent.isAuth = false;
        return this._http.post(this.href + 'token/is_auth', JSON.stringify({
                access_token: localStorage.getItem('access_token'),
            }), this.getHeaders())
            .map(res => res.json())
            .subscribe(data => {
                AppComponent.isAuth = true;
            })
    }


    private getHeaders() {
        return {headers: this._headers}
    }
}