import {Instrument} from "./instrument.model";

export interface Track {
    id : number,
    instrument: Instrument,
    sectorList: Array<Object>
}

interface SectorList {
    wave: Array<string> // lo,hi,mid - звуки 32 штуки
}