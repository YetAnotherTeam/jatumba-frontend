import {Instrument} from "./instrument.model";

export interface Track {
    id : number,
    instrument: Instrument,
    sectorList: sector[] // каждый сектор это квадрат из 32 звуков
}

interface sector {
    soundList: sound[] // 32 звука
}

interface sound {
    id: number
    val: string // название/изображение звука (общее)
    sound: string // название звука (конкретное для данного инструмента)
}