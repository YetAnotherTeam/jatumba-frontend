import {BaseService} from "./base.service";
export class BaseWebSocketService extends BaseService {
    protected baseWebSocketUrl: string;

    constructor() {
        super();
        let scheme = 'wss://';
        if (location.protocol === 'http:') {
            scheme = 'ws://'
        }
        this.scheme = scheme;
        this.baseWebSocketUrl = this.scheme + this.host + '/ws/';
    }
}
