import {Band} from "./band";


export interface Composition {
    id: number
    name: string
    band: Band
    genres: string[]
    latest_version: any
}
