const { RiskFactorLevels} = require('../models/supplyChainTree.js');

function calculateRiskFactor(likelihood, consequence) {
  const mapping_matrix =  [
    // flipped matrix to correspond to coordinate system
    ["L", "L", "L", "L", "M"],
    ["L", "L", "M", "M", "H"],
    ["L", "M", "M", "M", "H"],
    ["L", "M", "M", "H", "H"],
    ["M", "H", "H", "H", "H"],
  ];
  return mapping_matrix[likelihood-1][consequence-1]
}

const calculateRiskLevel = (consequence, likelihood) => {
  const riskLevel = calculateRiskFactor(consequence, likelihood)
  const valueMap = {
    L: RiskFactorLevels.LOW,
    M: RiskFactorLevels.MEDIUM,
    H: RiskFactorLevels.HIGH
  }
  return valueMap[riskLevel]
};

module.exports =  {
  calculateRiskLevel
}
