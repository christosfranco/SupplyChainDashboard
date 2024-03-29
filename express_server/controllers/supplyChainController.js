const { RiskFactorLevels} = require('../models/supplyChainTree.js');

const parserController = require('./parserSupplyChainController');
const concernController = require('./parserConcernController');

const getNodeDetails = (req, res) => {
  const requested_node_id = req.params.nodeID;
  const parsData = parserController.data.Nodes;
  const response = createNodeDetailsResponse(parsData, requested_node_id)
  res.status(200).send(response);
};

function createNodeDetailsResponse(parsData, requested_node_id) {
  return parsData
    .filter(node => node.Node_ID.toString() === requested_node_id)
    .map(node => {
      return {
        "id": node.Node_ID,
        "name": node.Node_name,
        "category": node.Type,
        "risks": node.Risks.map(mapConcernsToRisk)
      }
    })
}

function mapConcernsToRisk(risk) {
  const concern_tree = concernController.concernData.Concern_Trees
  const concernNames = risk.Concern_IDs.map(concern_id => findConcernNameById(concern_tree,concern_id))
  return {
    "name": risk.Name,
    "id": risk.Risk_ID,
    "consequenceLevel": risk.Consequence,
    "likelihoodLevel": risk.Likelihood,
    "riskFactor": risk.Likelihood * risk.Consequence,
    "mitigationStrategy": risk.Mitigation_Strategies,
    "concern" : concernNames.filter( String )
  }
}
function findConcernNameById(concern_tree, id) {
  for (const concern of concern_tree) {
    if (concern.Concern_ID === id) {
      return concern.Concern_name;
    }
    if (concern.Children.length > 0) {
      const childResult = findConcernNameById(concern.Children, id);
      if (childResult) {
        return childResult;
      }
    }
  }
  return undefined
}

const filterNodes = (req, res) => {
  const conditions = req.body['conditions'];

  if(!conditions){
    console.log("waiting for filter conditions...");
  }else {
    const nodes = parserController.data.Nodes;
    const filteredNodes = getFilteredNodesWithRiskLevels(conditions, nodes)
    console.log("Filtering returns: ", filteredNodes);
    res.status(200).send(filteredNodes);
  }
};

function getFilteredNodesWithRiskLevels(conditions, nodes) {
  return nodes
    .reduce((filteredNodes, node) => {

      const filteredRisk = node.Risks
        .filter(risk => filterRiskByConditions(risk, conditions))
        .map(risk => risk.Risk_Level);

      if (filteredRisk.length >0) {
        filteredNodes.push({
          "id": node.Node_ID.toString(),
          "high": filteredRisk.filter(riskFactor => riskFactor === RiskFactorLevels.HIGH).length,
          "medium": filteredRisk.filter(riskFactor => riskFactor ===RiskFactorLevels.MEDIUM).length,
          "low": filteredRisk.filter(riskFactor => riskFactor ===RiskFactorLevels.LOW).length
        })
      }

      return filteredNodes;
    }, []);
}

function filterRiskByConditions(risk, conditions) {
  return conditions.every(condition => {
    const filterFunction = constructConditionFunction[condition.conditionName]
    return filterFunction(risk, condition.operator, condition.value)
  })
}

const constructConditionFunction = {
  "risk_level" : function (risk, op, values) { return operator[op](risk["Consequence"], values) },
  "likelihood" : function (risk, op, values) { return operator[op](risk["Likelihood"], values) },
  "risk_factor": function (risk, op, values) { return operator[op](risk["Likelihood"] * risk["Consequence"], values)},
  "mitigation" : function (risk, _ , values) {
    return values==="yes"? risk.Mitigation_Strategies.length > 0: risk.Mitigation_Strategies.length === 0},
  "concerns": function (risk, op, values) {
    return values.some(value => risk["Concern_IDs"].includes(value))}
}

const operator = {
  'EQ': function (x, y) { return x === parseInt(y) },
  'LT': function (x, y) { return x <= parseInt(y)  },
  'GT': function (x, y) { return x >= parseInt(y)  },
  'IN': function (x, y) { return x in y.map(parseInt) },
};

module.exports = {
  getNodeDetails,
  filterNodes
};
