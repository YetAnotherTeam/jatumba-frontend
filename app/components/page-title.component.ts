import {Component, OnInit} from 'angular2/core';

@Component({
    selector: 'page-title',
    templateUrl: '/app/components/page-title.component.html',
    directives: [],
    providers: [],
    inputs: ["title"]
})
export class PageTitleComponent  {
    public title: string;
}
