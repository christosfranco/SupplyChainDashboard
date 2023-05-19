module.exports = {
  Node,
  Risk,
  Data,
  NodeOrError,
};

function Node() {
  this.Node_ID = 0;
  this.Root = false;
  this.Node_name = "";
  this.Type = "";
  this.Supplying_To = [];
  this.Suppliers = [];
  this.Risks = [];
}

function Risk() {
  this.Name = "";
  this.Risk_ID = 0;
  this.Consequence = 0;
  this.Likelihood = 0;
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

