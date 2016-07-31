import {Injectable} from "angular2/core";
import {Http} from "angular2/http";
import {User} from "./user";
import {BaseAPIService} from "../base/base.api.service";

@Injectable()
export class UserService extends BaseAPIService {
    constructor(private _http: Http) {
        super();
        this._headers.append('token', localStorage.getItem('access_token'));
    }

    list() {
        return this._http.get(this.baseAPIUrl + 'user/?page=3', this.getHeaders()).map(res => res.json())
    }

    get(id: number) {
        return this._http.get(this.baseAPIUrl + 'user/' + id + '/', this.getHeaders()).map(res => res.json())
    }

    update(user: User) {
        return this._http.put(this.baseAPIUrl + 'user/' + user.id + '/', JSON.stringify({
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            vk_profile: user.vk_profile,
            fb_profile: user.fb_profile,
        }), this.getHeaders())
            .map(res => res.json())
    }
}