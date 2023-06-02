const express = require('express');
const router = express.Router();
const supplyChainController = require('../controllers/supplyChainController');
const {handleFileGet} = require("../controllers/parserSupplyChainController");
const parserController  = require('../controllers/parserSupplyChainController')

const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()


// upload whatever

router.get('/getLocalSupplyChainFile',parserController.handleFileGet);

router.get('/getSupplyChainData',parserController.handleFileGetTest);

router.post('/postSupplyChainData',jsonParser,parserController.handleFilePost);



// router.get('/getLocalSupplyChainFile',parserController.handleFileGet);
// router.post('/postSupplyChainData',jsonParser,parserController.handleFilePost);
// router.get('/getSupplyChainData',parserController.handleFileGetTest);

router.get('/nodes', supplyChainController.getNodes);
router.get('/nodes/:nodeID/details', supplyChainController.getNodeDetails);
router.post('/nodes/filtered', supplyChainController.filterNodes);
router.post('/upload/supplychain', supplyChainController.uploadSupplyChain);
router.post('/upload/concerntree', supplyChainController.uploadConcernTree);

module.exports = router;
