import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {SupplyChainHome} from "./MVC/Controller/demo_controller";
import {SupplyChainVisualise} from "./MVC/Controller/visualization_controller";
import {NgOptimizedImage} from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { ImportComponent } from './components/import/import.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VisualizationPageComponent } from './components/visualization-page/visualization-page.component';
import { DagVisualisationComponent } from './components/dag-visualisation/dag-visualisation.component';
import { HighChartsVisComponent } from './components/high-charts-vis/high-charts-vis.component';
import {HighchartsChartModule} from "highcharts-angular";
import {NgxPanZoomModule} from "ngx-panzoom";
import { DetailsComponent } from './components/details/details.component';
import {MatDialogModule} from "@angular/material/dialog";
import {ModalModule} from "./components/modal/modal.component.module";
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    AppComponent,
    SupplyChainHome,
    SupplyChainVisualise,
    LandingPageComponent,
    ImportComponent,
    VisualizationPageComponent,
    DagVisualisationComponent,
    HighChartsVisComponent,
    DetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgOptimizedImage,
    HttpClientModule,
    BrowserAnimationsModule,
    HighchartsChartModule,
    NgxPanZoomModule,
    MatDialogModule,
    NgxPanZoomModule,
    ModalModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
