import {Member} from "../band/member";

export class User {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    vk_profile: string;
    fb_profile: string;
    members: Member[];

    toString() {
        return JSON.stringify({
            username: this.username,
            first_name: this.first_name,
            last_name: this.last_name,
            vk_profile: this.vk_profile,
            fb_profile: this.fb_profile,
        });
    }
}