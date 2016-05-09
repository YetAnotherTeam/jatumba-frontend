import {Component, OnInit, NgZone} from 'angular2/core';
import {Band} from './band'
import {Composition} from './composition'
import {Member} from './member'
import {BandService} from "./band.service";
import {Router, RouteParams, ROUTER_DIRECTIVES} from "angular2/router";
import {AuthService} from "../auth/auth.service";
import {ChatComponent} from "../components/chat.component";


@Component({
    selector: 'band-card',
    template: `
<h1>Банда</h1>
<main>
    <div *ngIf="band">
        <div>name: {{band.name}}</div>
        <div>{{band.description}}</div>
        <br>
        <div *ngIf="memberList">
            <div *ngFor="#member of memberList">
                <a class="collection-item" [routerLink]="['UserDetail', {'id': member.user.id}]">
                    <strong>{{member.user.username}}</strong> <br>
                </a>
                 <p>
                        {{member.user.first_name}} {{member.user.last_name}} - {{member.instrument}}
                 </p>
            </div>
        </div>
        <div>
            <button (click)="onJoinButton()">Присоединиться</button>
        </div>
        <div *ngIf="compositionList">
            <div *ngFor="#composition of compositionList">
                <a class="collection-item" [routerLink]="['Editor', {'id': composition.id}]">
                    {{composition.name}}    
                </a>
            </div>
        </div>
    </div>
</main>

<chat-component [band_id]="band.id" *ngIf="band">Chat should be loading</chat-component>
    `,
    providers: [BandService],
    directives: [ROUTER_DIRECTIVES, ChatComponent],
})

export class BandDetailComponent implements OnInit {
    id: number;
    band: Band;

    memberList: Member[];
    public memberListPaginationInfo : any;

    compositionList: Composition[];
    compositionListPaginationInfo: any;

    constructor(private _bandService: BandService, private _router: Router, private _authService: AuthService, params: RouteParams, private _ngZone: NgZone) {
        var self = this;
        this._authService.isAuth().then(function(isAuth) {
            if (!isAuth) {
                self._router.navigate(['Login']);
            }
        });
        this.id = +params.get('id');
    }

    private get_band_info() {
        this._bandService.get(this.id).subscribe((band: Band) => {
            this._ngZone.run(() => {
                this.band = band;
            })
        });
        this._bandService.members_list(this.id).subscribe((memberList: any) => {
            this._ngZone.run(() => {
                    this.memberList = memberList.results;
                    this.memberListPaginationInfo = memberList
                })
        });
        this._bandService.composition_list(this.id).subscribe((compositionList: any) => {
            this._ngZone.run(() => {
                this.compositionList = compositionList.results;
                this.compositionListPaginationInfo = compositionList
            })
        });
    }

    private onJoinButton() {
        var self = this;
        this._bandService.join(this.id).subscribe(data => this._ngZone.run(() =>
            self.get_band_info()
        ))
    }

    public visible = false;

    ngOnInit():any {
        this.get_band_info();
    }
}