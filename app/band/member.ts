import {Band} from "./band";
import {User} from "../user/user";

export interface Member {
    id: number,
    user: User,
    band: Band
}
