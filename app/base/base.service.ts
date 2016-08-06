import {Headers} from "angular2/http";

export class BaseService {
    protected _headers: Headers;
    protected scheme: string;
    protected host = "p30112.lab1.stud.tech-mail.ru";

    constructor() {
        this._headers = new Headers();
        this._headers.append('Content-Type', 'application/json');
    }

    protected getHeaders() {
        return {headers: this._headers}
    }
}