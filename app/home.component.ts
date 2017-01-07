import {Component} from '@angular/core';

@Component({
    selector: 'home',
    template: `
        <div class="container-fluid">
            <h1>{{appLongName}}</h1>
        </div>`
})

export class HomeComponent {
    appLongName = 'Brave Frontier Helper';
}
