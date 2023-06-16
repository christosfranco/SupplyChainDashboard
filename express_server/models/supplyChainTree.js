

function Node() {
  this.Node_ID = 0;
  this.Node_name = "";
  this.Type = "";
  this.Risks = [];
}

const GetNodesResponse = (rawNodes) => {
  return rawNodes.map( function(rawNode) {
    const parentIds = rawNodes
      .filter(n => n.Suppliers.includes(rawNode.Node_ID))
      .map(n => n.Node_ID.toString());
    return {
      id: rawNode.Node_ID.toString(),
      name: rawNode.Node_name,
      parentIds: parentIds
    }
  })
}

const RiskFactorLevels =Object.freeze({
  LOW: 1,
  MEDIUM: 3,
  HIGH: 5
});

function Risk() {
  this.Name = "";
  this.Risk_ID = 0;
  this.Consequence = RiskFactorLevels.LOW;
  this.Likelihood = RiskFactorLevels.LOW;
  this.Risk_Level = RiskFactorLevels.LOW;
  this.Mitigation_Strategies = [];
  this.Concern_IDs = [];
}

function Data() {
  this.Nodes = [];
}

module.exports = {
  Node,
  Risk,
  Data,
  RiskFactorLevels,
  GetNodesResponse
};
