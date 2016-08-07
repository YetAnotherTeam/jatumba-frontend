import {Component, OnInit, NgZone} from "@angular/core";
import {Band} from "./band";
import {Composition} from "./composition";
import {Member} from "./member";
import {BandService} from "./band.service";
import {ROUTER_DIRECTIVES} from "@angular/router";
import {AuthService} from "../auth/auth.service";
import {ChatComponent} from "../components/chat/chat.component";
import {Router, RouteParams} from "@angular/router-deprecated";


@Component({
    selector: 'band-card',
    templateUrl: `app/band/band-detail.component.html`,
    styleUrls: ['app/band/band-create.component.css'],
    providers: [BandService],
    directives: [ROUTER_DIRECTIVES, ChatComponent],
})

export class BandDetailComponent implements OnInit {
    id: number;
    band: Band;
    isEditMode: boolean;
    isLeader: boolean;

    memberList: Member[];
    isJoined: boolean;
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
        this.isJoined = false;
        this.isEditMode = false;
        this.isLeader = false;
    }

    private get_band_info() {
        this._bandService.get(this.id).subscribe((band: Band) => {
            this._ngZone.run(() => {
                this.isLeader = band.is_leader;
                this.isJoined = band.user_joined;
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
    
    private edit() {
        this.isEditMode = true;
    }
    
    private update() {
        this._bandService.update(this.band).subscribe((band: Band) => this._ngZone.run(() => {
            this.isEditMode = false;
            this.isLeader = band.is_leader;
            this.isJoined = band.user_joined;
            this.band = band;
        }))
    }

    public visible = false;

    ngOnInit():any {
        this.get_band_info();
    }
}
