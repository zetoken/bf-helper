import {Component} from '@angular/core';

@Component({
    selector: 'my-app',
    template: `
        <app-header></app-header>
        <div class="container-fluid">
            <div class="row" style="height:60px"></div>
            <h1>{{appLongName}}</h1>
        </div>
        <bf-craft></bf-craft>
        <app-footer></app-footer>`
})

export class AppComponent {
    appLongName = 'Brave Frontier Helper';
}
