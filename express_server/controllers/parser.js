const express = require('express');
const app = express();
const apiRoutes = require('../apis/apis');
const bodyParser = require('body-parser')
const { Node, Risk, Data } = require('../models/supplyChainTree.js');
const {instanceOf} = require("karma/common/util");


app.use('/api',apiRoutes);


app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


const data = new Data();
const inputFile = require('../../src/assets/nodes.json')
module.exports = {
  data,
  handleFilePost,
  handleFileGet,
  handleFileGetTest
};

function handleFilePost(req, res) {
  if (!req.accepts(['json'])) {
    res.status(406);
    res.send('Not Acceptable');
    return;
  }

  if (!req.body) {
    res.status(400);
    res.send('Invalid JSON payload');
    return;
  }

  try {
    let parsedData = parseData(req.body);
    if (parsedData instanceof Error) {
      console.error(parsedData);
      res.status(406);
      res.send(parsedData.message); // if Error, send Error message
    } else {
      console.log(parsedData);
      res.json(parsedData);
    }
  } catch (error) {
    console.error(error);
    res.status(400);
    res.send('Invalid JSON payload');
  }
}



function handleFileGet(req, res) {
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
}

// tests that the data instance is set globally

function handleFileGetTest(req, res) {
  res.send(data);
}
function parseData(jsonData) {

  // Check if the required "Nodes" field exists and is an array
  if (!Array.isArray(jsonData.Nodes)) {
    return Error('Invalid JSON: Missing or invalid "Nodes" field');
  }else {

    let parsedNodes = jsonData.Nodes.map(parseNode);
    if (parsedNodes.some(node => node instanceof Error)) {
      return parsedNodes.find(node => node instanceof Error);
    } else {
      data.Nodes = parsedNodes; // will only overwrite if valid
    }
  }
  return data;
}

function parseNode(jsonNode) {
  const node = new Node();
  let res =  checkType(jsonNode.Node_ID,node.Node_ID);
  if (res instanceof Error) {
    return res;
  } else {
    node.Node_ID = jsonNode.Node_ID;
  }


  let res3 = checkType(jsonNode.Node_name,node.Node_name);
  if (res3 instanceof Error) {
    return res3;
  } else {
    node.Node_name = jsonNode.Node_name;
  }

  let res1 = checkType(jsonNode.Type, node.Type);
  if (res1 instanceof Error) {
    return res1;
  } else {
    node.Type = jsonNode.Type;
  }


  let res2 =  checkType(jsonNode.Root, node.Root);
  if (res2 instanceof Error) {
    return res2;
  } else {
    node.Root = jsonNode.Root;
  }

  if (!Array.isArray(jsonNode.Suppliers)) {
    return Error(`Invalid 'Supplying_To' field in Node: ${jsonNode.Node_ID}`);
  } else {
    node.Suppliers = jsonNode.Suppliers;
  }
  if (!Array.isArray(jsonNode.Supplying_To)) {
    return Error(`Invalid 'Supplying_To' field in Node: ${jsonNode.Node_ID}`);
  } else {
    node.Supplying_To = jsonNode.Supplying_To;
  }
  let risks = parseRisks(jsonNode.Risks);
  if (risks instanceof Error) {
    return risks;
  } else {
    node.Risks = risks
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

  let res0 = checkType(jsonRisk.Name, risk.Name);
  if (res0 instanceof  Error ) {
    return new Error("Invalid 'Name' field in Risk");
  } else {
    risk.Name = jsonRisk.Name;
  }

  let res = checkType(jsonRisk.Risk_ID, risk.Risk_ID);
  if (instanceOf(Error,res )){
    return res;
  } else {
    risk.Risk_ID = jsonRisk.Risk_ID;
  }
  let res1 = checkType(jsonRisk.Consequence, risk.Consequence);
  if (instanceOf(Error,res )){
    return res1;
  } else {
    risk.Consequence = jsonRisk.Consequence;
  }
  let res2 = checkType(jsonRisk.Likelihood,  risk.Likelihood);
  if (instanceOf(Error,res )){
    return res2;
  }else {
    risk.Likelihood = jsonRisk.Likelihood;
  }
  if (!Array.isArray(jsonRisk.Mitigation_Strategies)) {
    return Error("Invalid 'Mitigation_Strategies' field in Risk");
  } else {
    risk.Mitigation_Strategies = jsonRisk.Mitigation_Strategies;
  }
  if (!Array.isArray(jsonRisk.Concern_IDs)) {
    return Error("Invalid 'Concern_IDs' field in Risk");
  } else {
    risk.Concern_IDs = jsonRisk.Concern_IDs;
  }
  return risk;
}

function checkType(actual, expected) {
  const tactual = typeof actual;
  const texpected = typeof expected;
  if (tactual !== texpected || (texpected === 'string' && actual === '')) {
    return Error(`Expected type: ${texpected} \n \
    Got type: ${tactual} and value: ${actual.valueOf()}\n \
    In Node with ID: ${actual.Node_ID} \n \
    In the field: ${JSON.stringify(actual[Object.keys(expected)[0]])}`);
  }
}

function checkUnexpectedFields(jsonData, expectedFields) {
  const unexpectedFields = [];

  function recurse(obj, path) {
    for (const key in obj) {
      const currentPath = path ? `${path}.${key}` : key;
      if (!expectedFields.includes(currentPath)) {
        unexpectedFields.push(currentPath);
      }
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        recurse(obj[key], currentPath);
      }
    }
  }

  recurse(jsonData, '');

  return unexpectedFields;
}
function compareStructuresBool(parsedData, expectedStructure) {
  function recurse(parsedObj, expectedObj) {
    for (const key in expectedObj) {
      if (!(key in parsedObj)) {
        return false;
      }
      if (typeof expectedObj[key] === 'object' && expectedObj[key] !== null) {
        if (typeof parsedObj[key] !== 'object' || parsedObj[key] === null) {
          return false;
        }
        if (!recurse(parsedObj[key], expectedObj[key])) {
          return false;
        }
      }
    }
    return true;
  }

  return recurse(parsedData, expectedStructure);
}

function compareStructures(parsedData, expectedStructure) {
  const unexpectedFields = [];

  function recurse(parsedObj, expectedObj, currentPath = '') {
    for (const key in parsedObj) {
      const fieldPath = currentPath ? `${currentPath}.${key}` : key;

      if (!(key in expectedObj)) {
        unexpectedFields.push(key);
        continue;
      }

      if (typeof expectedObj[key] === 'object' && expectedObj[key] !== null) {
        if (typeof parsedObj[key] !== 'object' || parsedObj[key] === null) {
          unexpectedFields.push(key);
          continue;
        }

        if (Array.isArray(expectedObj[key])) {
          if (!Array.isArray(parsedObj[key])) {
            unexpectedFields.push(key);
            continue;
          }

          // Check if array items match the expected structure
          for (let i = 0; i < parsedObj[key].length; i++) {
            recurse(parsedObj[key][i], expectedObj[key][0], `${fieldPath}[${i}]`);
          }
        } else {
          recurse(parsedObj[key], expectedObj[key], fieldPath);
        }
      }
    }
  }
  recurse(parsedData, expectedStructure);
  return unexpectedFields;
}

