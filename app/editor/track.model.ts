import {Instrument} from "./instrument.model";

export interface Track {
    id : number,
    instrument: Instrument,
    sectorList: sector[] // каждый сектор это квадрат из 32 звуков
    volume: number
}

interface sector {
    soundList: sound[] // 32 звука
}

interface sound {
    id: number
    name: string // название/изображение звука (общее)
    soundName: string // название звука (конкретное для данного инструмента)
}