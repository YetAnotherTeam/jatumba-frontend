import {BaseService} from "./base.service";
export class BaseAPIService extends BaseService {
    protected baseAPIUrl: string;

    constructor() {
        super();
        this.scheme = 'http://';
        this.baseAPIUrl = this.scheme + this.host + '/api/';
    }
}