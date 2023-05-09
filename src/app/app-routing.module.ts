import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SupplyChainHome } from "./MVC/Controller/demo_controller";
import { SupplyChainVisualise } from "./MVC/Controller/visualization_controller";
import {LandingPageComponent} from "./components/landing-page/landing-page.component";
import {VisualizationPageComponent} from "./components/visualization-page/visualization-page.component";

const routes: Routes = [
  {path: '', component: LandingPageComponent },
  {path: 'supply', component: SupplyChainHome },
  {path: 'visualise2', component: SupplyChainVisualise },
  {path: 'visualise', component: VisualizationPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
