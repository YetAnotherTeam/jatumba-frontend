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
        return this._http.get(this.href + 'user/?page=3', this.getHeaders()).map(res => res.json())
    }

    get(id: number) {
        return this._http.get(this.href + 'user/' + id + '/', this.getHeaders()).map(res => res.json())
    }

    update(user: User) {
        return this._http.patch(this.href + 'user/' + user.id + '/', JSON.stringify({
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            vk_profile: user.vk_profile,
            fb_profile: user.fb_profile,
        }), this.getHeaders())
            .map(res => res.json())
    }

    private getHeaders() {
        return {headers: this._headers}
    }
}