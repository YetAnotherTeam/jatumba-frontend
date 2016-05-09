export interface Instrument {
    id : number,
    name : string,
    sounds: Sound[],
    active: boolean
}

interface SoundArray {
    [index: string]: Sound;
}
interface Sound {
    id: number,
    name: string,
    soundName: string,
    active: boolean
}