import {Component, HostListener, ElementRef} from "angular2/core";
import {AuthService} from "../auth/auth.service";
import {ROUTER_DIRECTIVES, Router} from "angular2/router";

@Component({
    selector: 'nav-bar',
    templateUrl: '/app/components/nav-bar.html',
    inputs: ['routeName'],
    styleUrls: ['app/components/nav-bar.component.css'],
    directives: [ROUTER_DIRECTIVES],
    providers: [AuthService]
})

export class NavBarComponent {
    public routeName: string;
    public burgerIsOpen = false;
    public elementRef: ElementRef;

    public user = {};

    @HostListener('document:click', ['$event']) handleClick(event) {
        let clickedComponent:Node = event.target as Node;
        let inside = false;
        if (this.burgerIsOpen) {
            // do {
            //     if (clickedComponent === this.elementRef.nativeElement) {
            //         inside = true;
            //     }
            //     clickedComponent = clickedComponent.parentNode;
            // } while (clickedComponent);
            if (!inside) {
                this.burgerIsOpen = false;
            }
        }
    };


    constructor(myElement: ElementRef, private _authService: AuthService, private _router: Router) {
        var self = this;
        this.elementRef = myElement;
        this._authService.getUser().then(function (user) {
            self.user = user;
        })
    }

    openBurger() {
        setTimeout(() => {
            this.burgerIsOpen = !this.burgerIsOpen
        }, 0);

    }
    
    private logout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        this._router.navigate(['Login']);
    }
}