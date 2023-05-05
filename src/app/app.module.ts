import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {SupplyChainHome} from "./MVC/Controller/demo_controller";
import {SupplyChainVisualise} from "./MVC/Controller/visualization_controller";
import {NgOptimizedImage} from "@angular/common";
import { HttpClientModule } from "@angular/common/http";


@NgModule({
  declarations: [
    AppComponent,
    SupplyChainHome,
    SupplyChainVisualise
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgOptimizedImage,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
