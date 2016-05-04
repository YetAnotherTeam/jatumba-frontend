import {Member} from '../band/member'

export interface User {
    id: number
    first_name: string
    last_name: string
    username: string
    vk_profile: string
    fb_profile: string
    members: Member[]
}