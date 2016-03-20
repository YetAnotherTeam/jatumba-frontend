import {Injectable} from 'angular2/core'
import {USER_LIST} from "./mock-user-list";

@Injectable()
export class UserService {
    getUserList() {
        return Promise.resolve(USER_LIST);
    }
}