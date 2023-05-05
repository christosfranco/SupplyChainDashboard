import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SupplyChainHome } from "./MVC/Controller/demo_controller";
import { SupplyChainVisualise } from "./MVC/Controller/visualization_controller";

const routes: Routes = [
  {path: '', component: SupplyChainHome },
  {path: 'visualise', component: SupplyChainVisualise }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
