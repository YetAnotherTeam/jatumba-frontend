import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
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
}
