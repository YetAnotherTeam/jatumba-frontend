import {Member} from '../band/member'

export interface User {
    id: number
    first_name: string
    last_name: string
    username: string
    phone: string
    email: string
    members: Member[]
}