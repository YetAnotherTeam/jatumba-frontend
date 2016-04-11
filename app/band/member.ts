import {Band} from "./band";
import {User} from "../user/user";
import {Instrument} from "./instrument"

export interface Member {
    id: number,
    user: User,
    band: Band,
    instrument: Instrument
}

