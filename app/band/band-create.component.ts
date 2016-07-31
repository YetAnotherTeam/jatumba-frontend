import {OnInit, Component} from "angular2/core";
import {ROUTER_DIRECTIVES, Router, RouteParams} from "angular2/router";
import {BandService} from "./band.service";
import {Band} from "./band";
import {AuthService} from "../auth/auth.service";

@Component({
    templateUrl: '/app/band/band-create.component.html',
    selector: 'band-create',
    styleUrls: ['app/band/band-create.component.css'],
    directives: [ROUTER_DIRECTIVES],
    providers: [BandService]
})
export class BandCreateComponent implements OnInit {
    band: Band;
    name: string;
    description: string;

    constructor(private _bandService: BandService, private _router: Router, private _authService: AuthService, params: RouteParams) {
        var self = this;
        this._authService.isAuth().then(function (isAuth) {
            if (!isAuth) {
                self._router.navigate(['Login']);
            }
        });
        this.name = '';
        this.description = '';
    }

    createBand() {
        this._bandService.create(this.name, this.description).subscribe((band: Band) => {
            this.band = band;
            this._router.navigate(['BandDetail', {id: band.id}]);
        })
    }

    ngOnInit(): any {
    }
}
