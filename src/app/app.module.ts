import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {NgOptimizedImage} from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { ImportComponent } from './components/import/import.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VisualizationPageComponent } from './components/visualization-page/visualization-page.component';
import { DagVisualisationComponent } from './components/dag-visualisation/dag-visualisation.component';
import {HighchartsChartModule} from "highcharts-angular";
import {NgxPanZoomModule} from "ngx-panzoom";
import { UploadComponentComponent } from './components/upload-component/upload-component.component';
import { DetailsComponent } from './components/details/details.component';
import {FilterComponent} from "./components/filter/filter.component";
import {MatDialogModule} from "@angular/material/dialog";
import {ModalModule} from "./components/modal/modal.component.module";
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    ImportComponent,
    VisualizationPageComponent,
    DagVisualisationComponent,
    UploadComponentComponent,
    DetailsComponent,
    FilterComponent
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
