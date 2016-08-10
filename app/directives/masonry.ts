import {Directive, ContentChildren} from "angular2/src/core/metadata";
import {AfterViewInit} from "angular2/src/core/metadata/lifecycle_hooks";
import {ElementRef} from "angular2/src/core/linker/element_ref";

@Directive({
    selector: '[masonryItem]'
})
export class MasonryItemDirective {
}


@Directive({
    selector: '[masonry]'
})
export class MasonryDirective implements AfterViewInit {
    @ContentChildren(MasonryItemDirective) items;

    private _msnry: any;

    constructor(private _element: ElementRef) {
    }

    ngAfterViewInit(): any {
        this.initMasonry();
        this.items.changes.subscribe(() => {
            this.initMasonry();
            setTimeout(() => {
                this._msnry.layout();
            }, 500);
            setTimeout(() => {
                this._msnry.layout();
            }, 1000);
            setTimeout(() => {
                this._msnry.layout();
            }, 2000);
            setTimeout(() => {
                this._msnry.layout();
            }, 5000);
        });
    }

    initMasonry() {
        this._msnry = new Masonry(this._element.nativeElement, {
            itemSelector: '[masonryItem]',
            gutter: 20,
            fitWidth: true,
            transitionDuration: '0.4s'
        });
    }
}