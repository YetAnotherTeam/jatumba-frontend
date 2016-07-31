import {Http, Headers} from "angular2/http";

export class BaseService {

    private _headers: Headers;

    protected baseUrl = "http://p30112.lab1.stud.tech-mail.ru";

    constructor() {
        this._headers = new Headers();
        this._headers.append('Content-Type', 'application/json');
    }

    private getHeaders() {
        return {headers: this._headers}
    }
}