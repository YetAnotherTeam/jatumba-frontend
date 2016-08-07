import {User} from "./user";
import {BaseAPIService} from "../base/base.api.service";
import {Injectable} from "@angular/core";
import {Http} from "@angular/http";

@Injectable()
export class UserService extends BaseAPIService {
    constructor(private _http: Http) {
        super();
        this._headers.append('token', localStorage.getItem('access_token'));
    }

    list(page?: number) {
        var url = this.baseAPIUrl + 'user/';
        if (page) {
            url += '?page=' + page;
        }
        return this._http.get(url, this.getHeaders()).map(res => res.json())
    }

    get(id: number) {
        return this._http.get(this.baseAPIUrl + 'user/' + id + '/', this.getHeaders()).map(res => res.json())
    }

    update(user: User) {
        return this._http.put(this.baseAPIUrl + 'user/' + user.id + '/', user.toString(), this.getHeaders()).map(res => res.json())
    }
}