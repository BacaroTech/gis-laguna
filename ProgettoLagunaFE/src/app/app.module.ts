
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { provideHttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AppComponent } from './app.component';
import { MapComponent } from './components/map/map.component';

@NgModule({ declarations: [
        AppComponent,
        MapComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule], providers: [
        provideHttpClient(),
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule { }