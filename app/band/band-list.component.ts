import {Component, OnInit} from "@angular/core";
import {BandService} from "./band.service";
import {Band} from "./band";
import {ROUTER_DIRECTIVES} from "@angular/router";
import {AuthService} from "../auth/auth.service";
import {Router} from "@angular/router-deprecated";

@Component({
    selector: 'band-list',
    templateUrl: `app/band/band-list.component.html`,
    styleUrls: ['app/band/band-create.component.css'],
    directives: [ROUTER_DIRECTIVES],
    providers: [BandService]
})
export class BandListComponent implements OnInit {
    public bandList: Band[];

    public paginationInfo: any;

    constructor(private _bandService: BandService, private _router: Router, private _authService: AuthService) {
        var self = this;
        this._authService.isAuth().then(function(isAuth) {
            if (!isAuth) {
                self._router.navigate(['Login']);
            }
        })
    }

    list() {
        this._bandService.list().subscribe((bandList: any) => {
            this.bandList = bandList.results;
            this.paginationInfo = bandList;
        })
    }

    ngOnInit():any {
        this.list();
    }

}
