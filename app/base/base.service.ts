import {Headers} from "angular2/http";

export class BaseService {
    protected _headers: Headers;
    protected scheme: string;
    protected host = "jatumba.ml";

    constructor() {
        this._headers = new Headers();
        this._headers.append('Content-Type', 'application/json');
    }

    protected getHeaders() {
        return {headers: this._headers}
    }
}