import {provideRouter, RouterConfig} from "@angular/router";
import {RegisterComponent} from "./auth/register.component";
import {LoginComponent} from "./auth/login.component";
import {EditorComponent} from "./editor/editor.component";
import {BandDetailComponent} from "./band/band-detail.component";
import {BandListComponent} from "./band/band-list.component";
import {UserCardComponent} from "./user/user-card.component";
import {UserListComponent} from "./user/list/user-list.component";
import {BandCreateComponent} from "./band/band-create.component";

const routes: RouterConfig = [
    {path: '/users', component: UserListComponent},
    {path: '/users/:id', name: 'UserDetail', component: UserCardComponent},
    {path: '/bands', name: 'BandList', component: BandListComponent},
    {path: '/bands/create/', name: 'BandCreate', component: BandCreateComponent},
    {path: '/bands/:id', name: 'BandDetail', component: BandDetailComponent},
    {path: '/composition/:id', name: 'Editor', component: EditorComponent},
    {path: '/settings', name: 'Settings', component: EditorComponent},
    {path: '/', name: 'Login', component: LoginComponent},
    {path: '/register', name: 'Register', component: RegisterComponent}
];

export const appRouterProviders = [
    provideRouter(routes)
];