import {Headers, RequestOptions} from "angular2/http";

export class BaseService {
    protected _headers: Headers;
    protected scheme: string;
    protected host = "jatumba.ml";

    constructor() {
        this._headers = new Headers();
        this._headers.append('Content-Type', 'application/json');
        this._headers.append('Accept', '*/*');
    }

    protected getHeaders() {
        return new RequestOptions({ headers: this._headers });
    }
}