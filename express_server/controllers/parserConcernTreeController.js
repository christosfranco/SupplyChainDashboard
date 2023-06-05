const { Node, Risk, Data } = require('../models/supplyChainTree.js');

const checkConcernIdsExist = (concernTree, concernIds) => {
  const flattenedConcerns = flattenConcernTree(concernTree);
  const flattenedConcernIds = flattenedConcerns.map((concern) => concern.id);

  const missingConcernIds = concernIds.filter((id) => !flattenedConcernIds.includes(id));

  if (missingConcernIds.length > 0) {
    return new Error(`The following concern IDs are not found in the concern tree: ${missingConcernIds.join(', ')}`);
  }

  return true; // All concern IDs exist in the tree
};

const flattenConcernTree = (concernTree) => {
  let flattened = [];

  for (const concern of concernTree) {
    flattened.push(concern);
    if (concern.subconcerns && concern.subconcerns.length > 0) {
      flattened = flattened.concat(flattenConcernTree(concern.subconcerns));
    }
  }

  return flattened;
};



// const concernIdsToCheck = ["1.2.2.2", "2.1"]; // Example concern IDs to check

// const exist = checkConcernIdsExist(concernTreeDefault, concernIdsToCheck);
// console.log(`Concern IDs exist: ${exist}`);



module.exports =  {
  checkConcernIdsExist
}
