import {BaseService} from "./base.service";
export class BaseWebSocketService extends BaseService {
    protected baseWebSocketUrl: string;

    constructor() {
        super();
        this.scheme = 'wss://';
        this.baseWebSocketUrl = this.scheme + this.host + '/ws/';
    }
}