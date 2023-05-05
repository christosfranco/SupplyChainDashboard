import { Component } from '@angular/core';
import {Node} from "../Model/demo_model";

@Component({
  selector: 'app-user',
  templateUrl: '../View/import_view.html',
  styleUrls: ['../View/style/import_view.scss', "../View/style/visualize_view.scss", "../View/style/modular.scss",
              "../View/style/nicepage.scss"],
  //templateUrl: '../View/import_view.html',
  //styleUrls: []

})

export class SupplyChainHome {
  public imageUrl_help = "../../assets/images/help.png";
  nodes: Node[] = [
    {
      Node_ID: 1,
      Node_name: "Node 1",
      Type: "Type A",
      Root: true,
      Supplying_To: [
        2
      ],
      Suppliers: [],
      Risks: []
    },
    {
      Node_ID: 2,
      Node_name: "Node 2",
      Type: "Type B",
      Root: false,
      Supplying_To: [],
      Suppliers: [
        1
      ],
      Risks: [
        {
          Name: "Risk 1",
          Risk_ID: 1,
          Consequence: 5,
          Likelihood: 1,
          Mitigation_Strategies: ["Strategy 1", "Strategy 2"],
          Concern_IDs: [
            1,
            2,
            3
          ]
        }
      ]
    }
  ];
/*
  constructor(private http: HttpClient) {
    console.log('Constructor called');
    this.http.get<Node[]>('assets/nodes.json').subscribe(data => {
      console.log('Data received', data);
      this.nodes = data;
    });
  }
*/
}

/*
export class SupplyChain {
  supplyC: SupplyChainInterface = {
    id: 1,
    name: 'John Doe',
    concerns: 5
  };
}
*/






