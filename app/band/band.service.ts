import {AppComponent} from "../app.component";
import {Injectable} from "angular2/core";
import {Http} from "angular2/http";
import {Band} from "./band";
import {BaseAPIService} from "../base/base.api.service";

@Injectable()
export class BandService extends BaseAPIService {
    constructor(private _http: Http) {
        super();
        this._headers.append('token', localStorage.getItem('access_token'));
    }

    create(name: string, description: string) {
        return this._http.post(this.baseAPIUrl + 'band/', JSON.stringify({
            name: name,
            description: description
        }), this.getHeaders())
            .map(res => res.json())
    }

    list() {
        return this._http.get(this.baseAPIUrl + 'band/', this.getHeaders()).map(res => res.json())
    }

    get(id: number) {
        return this._http.get(this.baseAPIUrl + 'band/' + id + '/', this.getHeaders()).map(res => res.json())
    }

    update(band: Band) {
        return this._http.put(this.baseAPIUrl + 'band/' + band.id + '/', JSON.stringify({
            name: band.name,
            description: band.description
        }), this.getHeaders())
            .map(res => res.json())
    }

    join(band_id: number, instrument_id?: number) {
        return this._http.post(this.baseAPIUrl + 'member/', JSON.stringify({
            band: band_id,
            instrument: instrument_id
        }), this.getHeaders())
            .map(res => res.json())
    }

    members_list(band_id: number) {
        return this._http.get(this.baseAPIUrl + 'member/?band=' + band_id, this.getHeaders()).map(res => res.json())
    }

    composition_list(band_id: number) {
        return this._http.get(this.baseAPIUrl + 'composition/?band=' + band_id, this.getHeaders()).map(res => res.json());
    }

    composition_create(name: string, band: number) {
        return this._http.post(this.baseAPIUrl + 'composition/', JSON.stringify({
            band: band,
            name: name
        }), this.getHeaders())
            .map(res => res.json())
    }
}
