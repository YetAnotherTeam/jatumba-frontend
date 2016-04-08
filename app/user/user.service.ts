import {Injectable} from 'angular2/core'
import {Http, Headers} from "angular2/http";
import {AppComponent} from "../app.component";
import {User} from "./user";

@Injectable()
export class UserService {
    private _headers: Headers;

    private href = "http://p30112.lab1.stud.tech-mail.ru/api/";



    constructor(private _http: Http) {
        this._headers = new Headers();
        this._headers.append('Content-Type', 'application/json');
        this._headers.append('token', localStorage.getItem('access_token'));
    }

    list() {
        return this._http.get(this.href + 'user/', this.getHeaders()).map(res => res.json())
    }

    get(id: number) {
        return this._http.get(this.href + 'user/' + id + '/', this.getHeaders()).map(res => res.json())
    }

    update(user: User) {
        return this._http.put(this.href + 'user/' + user.id + '/', JSON.stringify({
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            phone: user.phone
        }), this.getHeaders())
            .map(res => res.json())
    }

    private getHeaders() {
        return {headers: this._headers}
    }
}