import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule}   from '@angular/forms';
import {HttpModule}    from '@angular/http';
import {RouterModule, Routes} from '@angular/router';

import {AppComponent} from './app.component';
import {HomeComponent} from './home.component';
import {CraftHelperComponent}  from './craft-helper.component';
import {AppHeaderComponent} from "./app-header.component";
import {AppFooterComponent} from "./app-footer.component";
import {BfCraftComponent} from "./bf-craft.component";
import {ObjectToArrayPipe} from './object-to-array.pipe';
import {FilterMaterialPipe} from "./filter-material.pipe";
import {FilterMaterialOfPipe} from './filter-materialOf.pipe';

const appRoutes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'craft',
        component: CraftHelperComponent
    },
    {
        path: '**',
        component: CraftHelperComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes),
        BrowserModule,
        FormsModule,
        HttpModule
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        CraftHelperComponent,
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