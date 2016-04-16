import {Component, OnInit, NgZone} from 'angular2/core';
import {Band} from './band'
import {Member} from './member'
import {BandService} from "./band.service";
import {Router, RouteParams, ROUTER_DIRECTIVES} from "angular2/router";
import {AuthService} from "../auth/auth.service";


@Component({
    selector: 'band-card',
    template: `
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
    </div>
    `,
    providers: [BandService],
    directives: [ROUTER_DIRECTIVES],
})

export class BandDetailComponent implements OnInit {
    id: number;
    band: Band;
    memberList: Member[];

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
        this._bandService.members_list(this.id).subscribe((memberList: Member[]) => {
            this._ngZone.run(() => {
                    this.memberList = memberList;
                })
        })
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