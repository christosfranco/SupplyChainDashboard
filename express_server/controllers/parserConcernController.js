const { Concern, ConcernData } = require('../models/concernModel')

const inputFile = require('../../src/assets/concern_model.json')

const concernData = new ConcernData();
const debugLog = true;

const uploadConcernModel = (req, res, _next) => {
  if (!req.accepts(['json', 'text'])) {
    res.status(406);
    res.send('Not Acceptable');
    if (debugLog) {
      console.log('Json post didnt work');
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
    let parsedConcernData = parseConcernData(req.body);
    if (parsedConcernData instanceof Error) {
      if (debugLog) {
        console.error(parsedConcernData);
        console.log("Json post Didnt work");
      }
      res.status(406);
      res.send(parsedConcernData.message); // if Error, send Error message
    } else {
      if (debugLog) {
        console.log(parsedConcernData);
      }
      res.json(parsedConcernData);
    }
  } catch (error) {
    if (debugLog) {
      console.error(error);
    }
    res.status(400);
    res.send('Invalid JSON payload');
  }
}

let concernIDs = new Set();

function parseConcernData(jsonData) {

  if (!Array.isArray(jsonData.Concern_Trees)) {
    return Error('Invalid JSON: Missing or invalid "Concerns_tree" field');
  } else {
    let parsedConcerns = jsonData.Concern_Trees.map(parseConcern);
    if (parsedConcerns.some(node => node instanceof Error)) {
      return parsedConcerns.find(node => node instanceof Error);
    }
    concernData.Concern_Trees = parsedConcerns;
    return concernData
  }
}

function parseConcern(jsonConcern) {
  const concern = new Concern();
  let children = [];

  for (const field in jsonConcern) {
    switch (field) {
      case 'Concern_ID' :
        if (concernIDs.has(jsonConcern[field])) {
          return Error(`Duplicate 'Concern_ID' found: ${jsonConcern.Concern_ID}`);
        }
        break;
      case 'Concern_name':
      case 'Children' :
        children = parseChildren(jsonConcern[field])
        if (children instanceof Error) {
          return children;
        }
        break;

      default:
        return Error(`Unexpected field '${field}' in Concern: ${jsonConcern.Concern_ID}`);

    }
  }

  for (const field in jsonConcern) {
    switch (field) {
      case 'Children':
        concern[field] = children;
        break;
      default:
        concern[field] = jsonConcern[field];
    }
  }
  return concern;
}

function parseChildren(jsonChildren) {
  if (Array.isArray(jsonChildren)) {
    if (jsonChildren === []) {
      return [];
    }
    const parsedChildren = jsonChildren.map(parseConcern);
    if (parsedChildren.some(concern => concern instanceof Error)) {
      return parsedChildren.find(concern => concern instanceof Error);
    }
    return parsedChildren
  }
}
const returnConcernTree = (req, res) => {
  res.status(200).send(concernData);
}

module.exports = {
  concernData,
  uploadConcernModel,
  returnConcernTree
  //handleConcernFileGet,

}
