

function Node() {
  this.Node_ID = 0;
  this.Node_name = "";
  this.Type = "";
  this.Suppliers = [];
  this.Risks = [];
}
const RiskFactorLevels =Object.freeze({
  VALUE1: 1,
  VALUE3: 3,
  VALUE5: 5
});

function Risk() {
  this.Name = "";
  this.Risk_ID = 0;
  this.Consequence = RiskFactorLevels.VALUE1;
  this.Likelihood = RiskFactorLevels.VALUE1;
  this.Risk_Level = RiskFactorLevels.VALUE1;
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
};
