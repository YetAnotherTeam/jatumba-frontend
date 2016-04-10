export interface Instrument {
    id : number,
    name : string,
    soundList: Sound[],
    active: boolean
}

interface SoundArray {
    [index: string]: Sound;
}
interface Sound {
    name: string,
    sound: string,
    active: boolean
}