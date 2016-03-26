import {Injectable} from 'angular2/core'
import {Http, Headers} from "angular2/http";

@Injectable()
export class AuthService {

    private _headers: Headers;

    private _auth = false;



    constructor(private _http: Http) {
        this._headers = new Headers();
        this._headers.append('Content-Type', 'application/json');
    }

    register(username:string, password:string) {
        return this._http.post('http://95.213.191.85/api/user/sign_up/', JSON.stringify({
            username: username,
            password: password
        }), this.getHeaders())
            .map(res => res.json())
    }

    login(username:string, password:string) {
        return this._http.post('http://95.213.191.85/api/user/sign_up/', JSON.stringify({
                username: username,
                password: password
            }), this.getHeaders())
            .map(res => res.json())
    }

    isAuth()

    private getHeaders() {
        return {headers: this._headers}
    }
}