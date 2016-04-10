import {Instrument} from "./instrument.model";

export interface Track {
    id : number,
    instrument: Instrument,
    sectorList: sector[] // 32 звука
}

interface sector {
    val: string // название/изображение звука (общее)
    sound: string // название звука (конкретное для данного инструмента)
}