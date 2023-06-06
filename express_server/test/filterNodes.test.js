//const { expect, assert } = require('chai');
const chai = require('chai');

const api = require('../apis/apis');
const handler = require('../controllers/supplyChainController');
const parserHandler = require('../controllers/parserSupplyChainController');
const initialJson = require('../../src/assets/hotel_example.json');
const expect = chai.expect;

const { createResponse } = require('node-mocks-http');

describe('Test filtering', () => {
    beforeEach((done) => {
      console.log('Upload supply chain to server in order to test filtering.');
      //const req = {body:initialJson};
      //const res = {};
      const req = {
        body: initialJson,
        headers: {
          accept: ['json', 'text'],
        },
        accepts: (type) => {
          return req.headers.accept;
        }
      };
      const res = createResponse();
      parserHandler.uploadSupplyChain(req, res);
      done();
    });

    // My tests
  it('Should successfully respond to valid API call with JSON', (done) => {
    const front_input = {
      conditions: [
        { conditionName: 'risk_level', operator: 'GT', value: '3' },
        { conditionName: 'risk_level', operator: 'LT', value: '5' },
        { conditionName: 'likelihood', operator: 'GT', value: '3' },
        { conditionName: 'likelihood', operator: 'LT', value: '5' }
      ]
    };
    const req = {body:front_input};
    const res = {
      status: function (statusCode) {
        expect(statusCode).to.equal(200);
        return this;
      },
      send: function (responseBody) {
        expect(responseBody).to.be.instanceOf(Object);
        done();
      }
    };
    handler.filterNodes(req, res);
  });
});

