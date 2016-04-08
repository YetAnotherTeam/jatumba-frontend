import {Band} from "./band";
import {User} from "../user/user";
import {Instrument} from "./instrument"

export interface Band {
    id: number,
    user: User,
    band: Band,
    instrument: Instrument
}

