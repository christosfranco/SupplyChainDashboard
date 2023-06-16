const chai = require('chai');

const api = require('../apis/apis');
const handler = require('../controllers/supplyChainController');
const parserHandler = require('../controllers/parserSupplyChainController');
const parserConcernHandler = require('../controllers/parserConcernController');
const initialJson = require('../../src/assets/hotel_example.json');
const initialConcernJson = require('../../src/assets/concern_model.json');
const { expect, assert } = require('chai');

const { createResponse } = require('node-mocks-http');

describe('Test filtering', () => {
  beforeAll((done) => {
    console.log('Upload concern tree to the server in order to test getNodeDetails.');
    //const req = {body:initialJson};
    //const res = {};
    const req = {
      body: initialConcernJson,
      headers: {
        accept: ['json', 'text'],
      },
      accepts: (type) => {
        return req.headers.accept;
      }
    };
    const res = createResponse();
    //parserHandler.uploadSupplyChain(req, res);
    parserConcernHandler.uploadConcernModel(req, res);
    done();
  });
  beforeAll((done) => {
    console.log('Upload supply chain to server in order to test getNodeDetails.');
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
  it('Test node with ID=1', (done) => {
    const req = {params: {nodeID:'1'}};
    const res = {
      status: function (statusCode) {
        expect(statusCode).to.equal(200);
        return this;
      },
      send: function (responseBody){
        expect(responseBody).to.deep.equal([
          {'id':1, 'name': 'Hotel Homepage', 'category': 'Website', 'risks': [
              {
                'id': 1,
                'name': 'DDOS Attack',
                'concern': ['Reliability', 'Safety', 'Confidentiality'],
                'consequenceLevel': 5,
                'likelihoodLevel':3,
                'riskFactor': 15,
                'mitigationStrategy': ['Antivir Software']
              },
            ]}
        ]);
        done();
      }
    };
    handler.getNodeDetails(req, res);
  });
  it('Test node with ID=3', (done) => {
    const req = {params: {nodeID:'3'}};
    const res = {
      status: function (statusCode) {
        expect(statusCode).to.equal(200);
        return this;
      },
      send: function (responseBody){
        expect(responseBody).to.deep.equal([
          {'id':3, 'name': 'Booking.com', 'category': 'Website', 'risks': [
              {
                'id': 2,
                'name': 'DDOS Attack',
                'concern': ['Reliability', 'Safety', 'Confidentiality'],
                'consequenceLevel': 5,
                'likelihoodLevel':1,
                'riskFactor': 5,
                'mitigationStrategy': ['Handled by external supplier']
              },
            ]}
        ]);
        done();
      }
    };
    handler.getNodeDetails(req, res);
  });
  it('Test node with ID=5', (done) => {
    const req = {params: {nodeID:'5'}};
    const res = {
      status: function (statusCode) {
        expect(statusCode).to.equal(200);
        return this;
      },
      send: function (responseBody){
        expect(responseBody).to.deep.equal([
          {'id':5, 'name': 'Firewall', 'category': 'Software', 'risks': [
              {
                'id': 4,
                'name': 'Exploit',
                'concern': ['Privacy', 'Reliability', 'Resilience', 'Safety', 'Security'],
                'consequenceLevel': 5,
                'likelihoodLevel':1,
                'riskFactor': 5,
                'mitigationStrategy': ['Regular Updates']
              },
            ]}
        ]);
        done();
      }
    };
    handler.getNodeDetails(req, res);
  });
  it('Test node with ID=7', (done) => {
    const req = {params: {nodeID:'7'}};
    const res = {
      status: function (statusCode) {
        expect(statusCode).to.equal(200);
        return this;
      },
      send: function (responseBody){
        expect(responseBody).to.deep.equal([
          {'id':7, 'name': 'Work Scheduler', 'category': 'Software', 'risks': [
              {
                'id': 6,
                'name': 'Bugs',
                'concern': ['Reliability', 'Resilience'],
                'consequenceLevel': 3,
                'likelihoodLevel':5,
                'riskFactor': 15,
                'mitigationStrategy': []
              },
            ]}
        ]);
        done();
      }
    };
    handler.getNodeDetails(req, res);
  });
  it('Test node with ID=6', (done) => {
    const req = {params: {nodeID:'6'}};
    const res = {
      status: function (statusCode) {
        expect(statusCode).to.equal(200);
        return this;
      },
      send: function (responseBody){
        expect(responseBody).to.deep.equal([
          {'id':6, 'name': 'Security Guards', 'category': 'Service', 'risks': [
              {
                'id': 5,
                'name': 'Breach of phyiscal access',
                'concern': ["Manipulation of phys. env."],
                'consequenceLevel': 5,
                'likelihoodLevel':1,
                'riskFactor': 5,
                'mitigationStrategy': []
              },
              {
                'id': 5,
                'name': 'Number of guards cannot patrol whole area',
                'concern': ["Manipulation of phys. env."],
                'consequenceLevel': 5,
                'likelihoodLevel':5,
                'riskFactor': 25,
                'mitigationStrategy': ["Security Cameras"]
              },
            ]}
        ]);
        done();
      }
    };
    handler.getNodeDetails(req, res);
  });
});
