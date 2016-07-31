import {BaseService} from "./base.service";
export class BaseAPIService extends BaseService{
    protected baseAPIUrl : string;
    constructor() {
        super();
        this.baseAPIUrl = this.baseUrl + '/api/';
    }
}