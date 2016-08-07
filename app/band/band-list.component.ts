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
    private new_band_name: string;
    private new_band_description: string;
    private searchInput: string;

    constructor(private _bandService: BandService, private _router: Router, private _authService: AuthService) {
        var self = this;
        this._authService.isAuth().then((isAuth) => {
            if (!isAuth) {
                this._router.navigate(['Login']);
            }
        }).catch((err) => {
            this._router.navigate(['Login']);
        });
    }

    list() {
        this._bandService.list().subscribe((bandList: any) => {
            this.bandList = bandList.results;
            this.paginationInfo = bandList;
        })
    }

    openNewBandDialogue() {
        $('#band_create_modal').openModal();
    }
    
    searchBand(event: any) {
        this._bandService.search(this.searchInput).subscribe((bandList: any) => {
            this.bandList = bandList.results;
            this.paginationInfo = bandList;
        });
    }

    createBand() {
        this._bandService.create(this.new_band_name, this.new_band_description).subscribe(band => {
            $('#band_create_modal').closeModal();
            this._router.navigate(['BandDetail', {'id': band.id}])
        })
    }

    ngOnInit():any {
        this.list();
    }

}
