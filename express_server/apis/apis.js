const express = require('express');
const router = express.Router();
const supplyChainController = require('../controllers/supplyChainController');
const ConcernModelController = require('../controllers/parserConcernController');
const parserController  = require('../controllers/parserSupplyChainController')

const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

router.get('/nodes',parserController.getNodes);
router.post('/upload/supplychain',jsonParser,parserController.uploadSupplyChain);
router.get('/nodes/:nodeID/details', supplyChainController.getNodeDetails);
router.post('/nodes/filtered', jsonParser, supplyChainController.filterNodes);
router.post('/upload/concerntree',jsonParser,ConcernModelController.uploadConcernModel);
router.get('/concerntree', ConcernModelController.returnConcernTree);

module.exports = router;
