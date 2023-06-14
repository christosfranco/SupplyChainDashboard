const { Node, Risk, Data ,RiskFactorLevels} = require('../models/supplyChainTree.js');

//levels are equal to the value or below
// if there is no lower level for a range they will be represented with 0

// represented by green
const lowLevel = 4;
// yellow
const midLevel = 12;
// red
const highLevel = 16;

// special values for when 1 of the modifiers are HIGH (5)
// represented by green
const lowLevel5 = 0;
// yellow
const midLevel5 = 5;
// red
const highLevel5 = 25;


// return values are
// LOW -> 1
// MID -> 3
// HIGH -> 5

const highLevelHelper = (Consequence , Likelihood,lowLevel,midLevel) => {
  let res = Consequence * Likelihood;
  if ( res > lowLevel ) {
      if (res > midLevel) {
        return RiskFactorLevels.VALUE5;
      }else {
        return RiskFactorLevels.VALUE3;
      }
  } else {
    return RiskFactorLevels.VALUE1;
  }
};

const calculateRiskLevel = (Consequence, Likelihood) => {
  if (Consequence === RiskFactorLevels.VALUE5 || Likelihood === RiskFactorLevels.VALUE5  ) {
    return highLevelHelper(Consequence, Likelihood,lowLevel5,midLevel5);
  } else {
    return highLevelHelper(Consequence, Likelihood,lowLevel,midLevel);
  }
};

// const Cons = RiskFactorLevels.VALUE3; // Example concern IDs to check
// const Like = RiskFactorLevels.VALUE3
//
// const exist = calculateRiskLevel(Cons, Like);
// console.log(`RIsk level : ${exist}`);


module.exports =  {
  calculateRiskLevel
}
