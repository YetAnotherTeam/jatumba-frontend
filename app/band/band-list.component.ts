import {Component, OnInit} from 'angular2/core';
import {BandService} from "./band.service";
import {Band} from "./band";
import {Router, ROUTER_DIRECTIVES} from "angular2/router";
import {AppComponent} from "../app.component";
import {AuthService} from "../auth/auth.service";

@Component({
    selector: 'band-list',
    template: `
<main>
<div class="container">
<div class="row">
<div class="col s12 m9 l10">
<div class="collection">
    <div>

        <div *ngFor="#band of bandList">
            <a class="collection-item">
                <strong>{{band.name}}</strong> <br>
            </a>
             <p>
                    {{band.description}}
             </p>
        </div>
    </div>

</div>
</div>
</div>
</div>
</main>
    `,
    directives: [ROUTER_DIRECTIVES],
    providers: [BandService]
})
export class BandListComponent implements OnInit {
    public bandList: Band[];

    constructor(private _bandService: BandService, private _router: Router, private _authService: AuthService) {
        var self = this;
        this._authService.isAuth().then(function(isAuth) {
            if (!isAuth) {
                self._router.navigate(['Login']);
            }
        })
    }

    list() {
        this._bandService.list().subscribe((bandList: Band[]) => this.bandList = bandList)
    }

    ngOnInit():any {
        this.list();
    }

}
