import {Injectable} from 'angular2/core'
import {Http, Headers} from "angular2/http";
import {AppComponent} from "../app.component";
import {Band} from "./band";

@Injectable()
export class BandService {
    private _headers: Headers;

    private href = "http://p30112.lab1.stud.tech-mail.ru/api/";

    constructor(private _http: Http) {
        this._headers = new Headers();
        this._headers.append('Content-Type', 'application/json');
        this._headers.append('token', localStorage.getItem('access_token'));
    }

    list() {
        return this._http.get(this.href + 'band/', this.getHeaders()).map(res => res.json())
    }

    get(id: number) {
        return this._http.get(this.href + 'band/' + id + '/', this.getHeaders()).map(res => res.json())
    }

    update(band: Band) {
        return this._http.patch(this.href + 'band/' + band.id + '/', JSON.stringify({
            name: band.name,
            description: band.description
        }), this.getHeaders())
            .map(res => res.json())
    }

    join(band_id: number, instrument_id?: number) {
        return this._http.post(this.href + 'member/', JSON.stringify({
            band: band_id,
            instrument: instrument_id
        }), this.getHeaders())
            .map(res => res.json())
    }

    members_list(band_id: number) {
        return this._http.get(this.href + 'member/?band=' + band_id, this.getHeaders()).map(res => res.json())
    }

    private getHeaders() {
        return {headers: this._headers}
    }
}
