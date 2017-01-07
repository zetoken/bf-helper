import {Component} from '@angular/core';

@Component({
    selector: 'craft-helper',
    template: `
        <div class="container-fluid">
            <h1>{{appLongName}}</h1>
        </div>
        <bf-craft></bf-craft>`
})

export class CraftHelperComponent {
    appLongName = 'Brave Frontier Helper';
}
