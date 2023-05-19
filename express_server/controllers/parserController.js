const { Node, Risk, Data } = require('../models/supplyChainTree.js');
const {instanceOf} = require("karma/common/util");

const data = new Data();
const inputFile = require('../../src/assets/nodes.json')


const handleFilePost = (req, res, next) => {
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
};



const handleFileGet = (req, res,next) => {
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

// tests that the data instance is set globally

const handleFileGetTest = (req, res,next) => {
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
  let risks = new Risk();

  for (const field in jsonNode) {
    switch (field) {
      case 'Node_ID':
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

      case 'Root':
        let res2 = checkType(jsonNode[field], node[field]);
        if (res2 instanceof Error) {
          return res2;
        }
        break;

      case 'Suppliers':
      case 'Supplying_To':
        if (!Array.isArray(jsonNode[field])) {
          return Error(`Invalid '${field}' field in Node: ${jsonNode.Node_ID}`);
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

  // ensure data not overwritten unless all parsed
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

  for (const field in jsonRisk) {
    switch (field) {
      case 'Name':
        let res0 = checkType(jsonRisk[field], risk[field]);
        if (res0 instanceof Error) {
          return new Error("Invalid 'Name' field in Risk");
        }
        break;

      case 'Risk_ID':
      case 'Consequence':
      case 'Likelihood':
        let res = checkType(jsonRisk[field], risk[field]);
        if (res instanceof Error) {
          return res;
        }
        break;

      case 'Mitigation_Strategies':
      case 'Concern_IDs':
        if (!Array.isArray(jsonRisk[field])) {
          return Error(`Invalid '${field}' field in Risk`);
        }
        break;

      default:
        return Error(`Unexpected field '${field}' in Risk`);
    }
  }

  for (const field in jsonRisk) {
    risk[field] = jsonRisk[field];
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

module.exports = {
  data,
  handleFilePost,
  handleFileGet,
  handleFileGetTest,
};
