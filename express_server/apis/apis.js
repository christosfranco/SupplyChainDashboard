const express = require('express');
const router = express.Router();
const supplyChainController = require('../controllers/supplyChainController');
const ConcernModelController = require('../controllers/parserConcernController');
const {handleFileGet} = require("../controllers/parserSupplyChainController");
const parserController  = require('../controllers/parserSupplyChainController')

const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

// router.get('/getLocalSupplyChainFile',parserController.handleFileGet);
// router.post('/postSupplyChainData',jsonParser,parserController.handleFilePost);
// router.get('/getSupplyChainData',parserController.handleFileGetTest);

router.get('/nodes',parserController.getNodes);
router.post('/upload/supplychain',jsonParser,parserController.uploadSupplyChain);
router.get('/nodes/:nodeID/details', supplyChainController.getNodeDetails);
router.post('/nodes/filtered', jsonParser, supplyChainController.filterNodes);
router.post('/upload/concerntree',jsonParser,ConcernModelController.uploadConcernModel);
router.get('/concerntree', ConcernModelController.returnConcernTree);

module.exports = router;
