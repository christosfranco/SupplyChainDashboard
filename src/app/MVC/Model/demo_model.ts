export interface SupplyChainInterface {
  id: number;
  name: string;
  concerns: number;
}

export interface Person {
  name: string;
  age: number;
}

export interface Node {
  Node_ID: number;
  Root: boolean;
  Node_name: string;
  Type: string;
  Supplying_To: number[];
  Suppliers: any[];
  Risks: Risk[];
}

export  interface Risk {
  Name: string;
  Risk_ID: number;
  Consequence: number;
  Likelihood: number;
  Mitigation_Strategies: string[];
  Concern_IDs: number[];
}

export interface Data {
  Nodes: Node[];
}



