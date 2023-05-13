const express = require('express');
const router = express.Router();
const supplyChainController = require('../controllers/supplyChainController');

router.get('/nodes', supplyChainController.getNodes);
router.get('/nodes/{nodeID}/details', supplyChainController.getNodeDetails);
router.post('/nodes/filtered', supplyChainController.filterNodes);
router.post('/upload/supplychain', supplyChainController.uploadSupplyChain);
router.post('/upload/concerntree', supplyChainController.uploadConcernTree);

module.exports = router;
