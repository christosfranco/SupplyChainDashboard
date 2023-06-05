const { Node, Risk, Data, GetNodesResponse } = require('../models/supplyChainTree.js');
const {checkConcernIdsExist} = require('./parserConcernTreeController');
const {concernTreeDefault} = require('../models/concernTreeModel');
const {calculateRiskLevel} = require('./riskLevelCalculateController');

// constants
const data = new Data();
const inputFile = require('../../src/assets/nodes.json')
const debugLog = true;
const allowSelfSupply = false;
const rootNodeNumber = 0;


const uploadSupplyChain = (req, res, _next) => {
  if (!req.accepts(['json', 'text'])) {
    res.status(406);
    res.send('Not Acceptable');
    if (debugLog) {
      console.log("Json post Didnt work");
    }
    return;
  }

  if (!req.body) {
    res.status(400);
    res.send('Invalid JSON payload');
    if (debugLog) {
      console.log(req);
      console.log(req.body);
      console.log("no body in payload Json post Didnt work");
    }
    return;
  }

  try {
    let parsedData = parseData(req.body);
    if (parsedData instanceof Error) {
      if (debugLog) {
        console.error(parsedData);
        console.log("Json post Didnt work");
      }
      res.status(406);
      res.send(parsedData.message); // if Error, send Error message
    } else {
      if (debugLog) {
        console.log(parsedData);
      }
      res.json(parsedData);
    }
  } catch (error) {
    if (debugLog) {
      console.error(error);
    }
    res.status(400);
    res.send('Invalid JSON payload');
  }
};



const handleFileGet = (req, res,_next) => {
  if (!req.accepts(['json', 'text'])) {
    res.status(406);
    res.send('Not Acceptable');
  }else {
      let parsedData = parseData(inputFile);
      if (parsedData instanceof Error){
        console.error(parsedData);
        res.status(406);
        res.send(parsedData.message); // if Error send Error message
      } else {
        console.log(parsedData);
        res.json(parsedData);
      }
  }
};


const getNodes = (req, res,_next) => {
  const getNodesResponse = GetNodesResponse(data.Nodes);
  res.send(getNodesResponse);
}


let nodeIDs = new Set(); // To track duplicate Node_IDs

function parseData(jsonData) {

  nodeIDs = new Set();
  // Check if the required "Nodes" field exists and is an array
  if (!Array.isArray(jsonData.Nodes)) {
    return Error('Invalid JSON: Missing or invalid "Nodes" field');
  }else {

    let parsedNodes = jsonData.Nodes.map(parseNode);
    if (parsedNodes.some(node => node instanceof Error)) {
      return parsedNodes.find(node => node instanceof Error);
    } else {
      let checkedSuppliers = jsonData.Nodes.map(checkSuppliers)
      if (checkedSuppliers.some(node => node instanceof Error)) {
        return checkedSuppliers.find(node => node instanceof Error);
      }
      data.Nodes = parsedNodes; // will only overwrite if valid
    }
  }
  return data;
}

function checkSuppliers(jsonNode) {
  // Check if IDs exist in Node_IDs
  for (const id of jsonNode.Suppliers) {
    if (!nodeIDs.has(id)) {
      return Error(`Invalid '${jsonNode.Suppliers}' ID '${id}' in Node: ${jsonNode.Node_ID}`);
    }
  }
}

function parseNode(jsonNode) {
  const node = new Node();
  let risks = [];

  for (const field in jsonNode) {
    switch (field) {
      case 'Node_ID':
        if (nodeIDs.has(jsonNode[field])) {
          return Error(`Duplicate 'Node_ID' found: ${jsonNode.Node_ID}`);
        }
        if (allowSelfSupply) {
          nodeIDs.add(jsonNode.Node_ID);
        }
        let res = checkType(jsonNode[field], node[field]);
        if (res instanceof Error) {
          return res;
        }
        break;

      case 'Node_name':
      case 'Type':
        let res1 = checkType(jsonNode[field], node[field]);
        if (res1 instanceof Error) {
          return res1;
        }
        break;

      case 'Suppliers':
        const arrResCon = checkTypeArray(jsonNode[field], 1);
        if (arrResCon instanceof Error) {
          return arrResCon;
        }
        break;

      case 'Risks':
        risks = parseRisks(jsonNode[field]);
        if (risks instanceof Error) {
          return risks;
        }
        break;

      default:
        return Error(`Unexpected field '${field}' in Node: ${jsonNode.Node_ID}`);
    }

  }
  // only add Node_ID if everything parses, will also ensure cant supply to itself
  if (!allowSelfSupply) {
    nodeIDs.add(jsonNode.Node_ID);
  }
  // ensure data not overwritten unless all parsed
  // this is fixed with init of new node.
  for (const field in jsonNode) {
    switch (field){
      case 'Risks':
        node[field] = risks;
        break
      default:
        node[field] = jsonNode[field];
    }
  }
  return node;
}

function parseRisks(jsonRisks) {
  if (Array.isArray(jsonRisks)) {
    if (jsonRisks === []) {
      return [];
    }
    const parsedRisks = jsonRisks.map(parseRisk);
    if (parsedRisks.some(risk => risk instanceof Error)) {
      return parsedRisks.find(node => node instanceof Error);
    }
    return parsedRisks;
  }
}


function parseRisk(jsonRisk) {
  const risk = new Risk();
  // console.log(jsonRisk);
  if (jsonRisk === []) {
    return risk;
  }
  for (const field in jsonRisk) {
    switch (field) {
      case 'Name':
        let res0 = checkType(jsonRisk[field], risk[field]);
        if (res0 instanceof Error) {
          return new Error("Invalid 'Name' field in Risk");
        }
        break;

      case 'Consequence':
      case 'Likelihood':
        let res1 = checkType(jsonRisk[field], risk[field]);
        if (res1 instanceof Error) {
          return res1;
        }
        break;

      case 'Risk_ID':
        let res = checkType(jsonRisk[field], risk[field]);
        if (res instanceof Error) {
          return res;
        }
        break;

      case 'Concern_IDs':
        const concernIDS = jsonRisk[field]
        const arrResCon = checkTypeArray(concernIDS, " ");
        if (arrResCon instanceof Error) {
          return arrResCon;
        }
        // concernforest is a list of concerntree
        // if returning false throw error
        const checkIdsInConcernTree = checkConcernIdsExist(concernTreeDefault,concernIDS);
        if (checkIdsInConcernTree  instanceof Error){
          return checkIdsInConcernTree;
        }
        break;

      case 'Mitigation_Strategies':
        const arrRes = checkTypeArray(jsonRisk[field], " ");
        if (arrRes instanceof Error){
          return arrRes;
        }
        break;

      default:
        return Error(`Unexpected field '${field}' in Risk`);
    }
  }

  for (const field in jsonRisk) {
    risk[field] = jsonRisk[field];
  }

  //calculate risk level
  risk['Risk_Level'] = calculateRiskLevel(jsonRisk['Consequence'], jsonRisk['Likelihood']);

  return risk;
}
function checkTypeArray(array, expected) {
  if (!Array.isArray(array)) {
    return Error(`Not array in Node: ${array.Node_ID}`);
  }
  if (array === []) {
    return true;
  }
  for (const value of array) {
    const result = checkType(value, expected);
    if (result instanceof Error) {
      return result;
    }
  }
  return true;
}

// checks actual type is equal to expected, for strings also check nonempty string
function checkType(actual, expected) {
  const tactual = typeof actual;
  const texpected = typeof expected;
  if (tactual !== texpected || (texpected === ('number') && actual < rootNodeNumber) || (texpected === 'string' && actual === '')) {
    return Error(`Expected type: ${texpected} \n \
    Got type: ${tactual} and value: ${actual.valueOf()}\n \
    In Node with ID: ${actual.Node_ID} \n \
    In Risk with ID: ${actual.Risk_ID} \n \
    In the field: ${JSON.stringify(actual[Object.keys(expected)[0]])}`);
  }
}

module.exports = {
  data,
  uploadSupplyChain,
  handleFileGet,
  getNodes,
  Risk,
  parseNode,
  parseRisks,
  parseRisk,
  checkTypeArray,
  checkType,
  Node,
};
