import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule}   from '@angular/forms';
import {HttpModule}    from '@angular/http';

import {AppComponent}  from './app.component';
import {AppHeaderComponent} from "./app-header.component";
import {AppFooterComponent} from "./app-footer.component";
import {BfCraftComponent} from "./bf-craft.component";
import {ObjectToArrayPipe} from './object-to-array.pipe';
import {FilterMaterialPipe} from "./filter-material.pipe";
import {FilterMaterialOfPipe} from './filter-materialOf.pipe';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule
    ],
    declarations: [
        AppComponent,
        AppHeaderComponent,
        AppFooterComponent,
        BfCraftComponent,
        ObjectToArrayPipe,
        FilterMaterialPipe,
        FilterMaterialOfPipe
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}