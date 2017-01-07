import {Component} from '@angular/core';

@Component({
    selector: 'bf-app',
    template: `
        <app-header></app-header>
        <div class="container-fluid">
            <div class="row" style="height:60px"></div>
        </div>
        <router-outlet></router-outlet>
        <app-footer></app-footer>`,
})

export class AppComponent {
}
