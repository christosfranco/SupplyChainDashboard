

function Node() {
  this.Node_ID = 0;
  // this.Root = false;
  this.Node_name = "";
  this.Type = "";
  // this.Supplying_To = [];
  this.Suppliers = [];
  this.Risks = [];
}
const MyEnum = {
  VALUE1: 1,
  VALUE3: 3,
  VALUE5: 5
};

function Risk() {
  this.Name = "";
  this.Risk_ID = 0;
  this.Consequence = MyEnum.VALUE1;
  this.Likelihood = MyEnum.VALUE1;
  this.Mitigation_Strategies = [];
  this.Concern_IDs = [];
}

function Data() {
  this.Nodes = [];
}
function NodeOrError(node, error) {
  this.node = node;
  this.error = error;
}


module.exports = {
  Node,
  Risk,
  Data,
  NodeOrError,
  MyEnum,
};
