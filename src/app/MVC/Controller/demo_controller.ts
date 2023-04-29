import { Component } from '@angular/core';
import {SupplyChainInterface} from "../Model/demo_model";
@Component({
  selector: 'app-user',
  templateUrl: '../View/demo_view.html',
  styleUrls: ['../View/demo_view.scss']
})
export class SupplyChain {
  supplyC: SupplyChainInterface = {
    id: 1,
    name: 'John Doe',
    concerns: 5
  };
}
