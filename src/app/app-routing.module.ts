import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LandingPageComponent} from "./components/landing-page/landing-page.component";
import {VisualizationPageComponent} from "./components/visualization-page/visualization-page.component";
import { ModalModule} from "./components/modal/modal.component.module";

const routes: Routes = [
  {path: '', component: LandingPageComponent },
  {path: 'visualise', component: VisualizationPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), ModalModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
