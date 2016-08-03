import {Component, OnInit} from 'angular2/core';
import {BandService} from "./band.service";
import {Band} from "./band";
import {Router, ROUTER_DIRECTIVES} from "angular2/router";
import {AppComponent} from "../app.component";
import {AuthService} from "../auth/auth.service";

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
