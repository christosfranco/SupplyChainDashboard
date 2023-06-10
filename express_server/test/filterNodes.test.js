//const { expect, assert } = require('chai');
const chai = require('chai');

const api = require('../apis/apis');
const handler = require('../controllers/supplyChainController');
const parserHandler = require('../controllers/parserSupplyChainController');
const initialJson = require('../../src/assets/hotel_example.json');
const { expect, assert } = require('chai');

const { createResponse } = require('node-mocks-http');

describe('Test filtering', () => {
    beforeAll((done) => {
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

  it('Should return empty test', (done) =>{
    const front_input = {
      conditions: [
          { conditionName: 'risk_level' ,operator: 'EQ', value: '2'},
          { conditionName: 'likelihood' ,operator: 'EQ', value: '4'},
          { conditionName: 'risk_factor' ,operator: 'EQ', value: '5'}
      ]
    };
    const req = {body:front_input};
    const res = {
      status: function (statusCode) {
        expect(statusCode).to.equal(200);
        return this;
      },
      send: function (responseBody){
        expect(responseBody).to.deep.equal([]);
        done();
      }
    };
    handler.filterNodes(req, res);
  });
  it('Random test nr.1', (done) =>{
    const front_input = {
      conditions: [
        {conditionName: 'risk_level' ,operator: 'GT', value: '1'},
        {conditionName: 'risk_level' ,operator: 'LT', value: '4'},
        {conditionName: 'likelihood' ,operator: 'GT', value: '2'},
        {conditionName: 'likelihood' ,operator: 'LT', value: '3'},
      ]
    };
    const req = {body:front_input};
    const res = {
      status: function (statusCode) {
        expect(statusCode).to.equal(200);
        return this;
      },
      send: function (responseBody){
        expect(responseBody).to.deep.equal([{
          "id":'8',
          "high":0,
          "medium":0,
          "low":1
        }]);
        done();
      }
    };
    handler.filterNodes(req, res);
  });
  it('Random test nr.2', (done) =>{
    const front_input = {
      conditions: [
        {conditionName: 'risk_level' ,operator: 'EQ', value: '5'},
        {conditionName: 'likelihood' ,operator: 'EQ', value: '1'},
      ]
    };
    const req = {body:front_input};
    const res = {
      status: function (statusCode) {
        expect(statusCode).to.equal(200);
        return this;
      },
      send: function (responseBody){
        expect(responseBody).to.deep.equal([
          {
            "id":'2',
            "high":0,
            "medium":1,
            "low":0
          },
          {
            "id":'3',
            "high":0,
            "medium":1,
            "low":0
          },
          {
            "id":'5',
            "high":0,
            "medium":1,
            "low":0
          },
          {
            "id":'6',
            "high":0,
            "medium":1,
            "low":0
          }
        ]);
        done();
      }
    };
    handler.filterNodes(req, res);
  });
  it('Impossible test risk_factor != risk_level*likelihood', (done) =>{
    const front_input = {
      conditions: [
        {conditionName: 'risk_level' ,operator: 'EQ', value: '5'},
        {conditionName: 'likelihood' ,operator: 'GT', value: '1'},
        {conditionName: 'likelihood' ,operator: 'LT', value: '3'},
        {conditionName: 'risk_factor' ,operator: 'EQ', value: '4'},
      ]
    };
    const req = {body:front_input};
    const res = {
      status: function (statusCode) {
        expect(statusCode).to.equal(200);
        return this;
      },
      send: function (responseBody){
        expect(responseBody).to.deep.equal([]);
        done();
      }
    };
    handler.filterNodes(req, res);
  });
  it('Random test nr.3', (done) =>{
    const front_input = {
      conditions: [
        {conditionName: 'risk_level' ,operator: 'EQ', value: '1'},
      ]
    };
    const req = {body:front_input};
    const res = {
      status: function (statusCode) {
        expect(statusCode).to.equal(200);
        return this;
      },
      send: function (responseBody){
        expect(responseBody).to.deep.equal([{
          "id":'8',
          "high":0,
          "medium":0,
          "low":1
        }]);
        done();
      }
    };
    handler.filterNodes(req, res);
  });
  it('Example with mitigation strategy == no', (done) =>{
    const front_input = {
      conditions: [
        {conditionName: 'risk_level' ,operator: 'GT', value: '4'},
        {conditionName: 'risk_level' ,operator: 'LT', value: '5'},
        {conditionName: 'likelihood' ,operator: 'EQ', value: '1'},
        {conditionName: 'mitigation' ,operator: 'EQ', value: 'no'},
        {conditionName: 'risk_factor' ,operator: 'EQ', value: '5'},
      ]
    };
    const req = {body:front_input};
    const res = {
      status: function (statusCode) {
        expect(statusCode).to.equal(200);
        return this;
      },
      send: function (responseBody){
        expect(responseBody).to.deep.equal([{
          "id":'6',
          "high":0,
          "medium":1,
          "low":0
        }]);
        done();
      }
    };
    handler.filterNodes(req, res);
  });
  it('Example with mitigation strategy == yes', (done) =>{
    const front_input = {
      conditions: [
        {conditionName: 'risk_level' ,operator: 'GT', value: '4'},
        {conditionName: 'risk_level' ,operator: 'LT', value: '5'},
        {conditionName: 'likelihood' ,operator: 'EQ', value: '1'},
        {conditionName: 'mitigation' ,operator: 'EQ', value: 'yes'},
        {conditionName: 'risk_factor' ,operator: 'EQ', value: '5'},
      ]
    };
    const req = {body:front_input};
    const res = {
      status: function (statusCode) {
        expect(statusCode).to.equal(200);
        return this;
      },
      send: function (responseBody){
        expect(responseBody).to.deep.equal([
          {
            "id":'2',
            "high":0,
            "medium":1,
            "low":0
          },
          {
            "id":'3',
            "high":0,
            "medium":1,
            "low":0
          },
          {
            "id":'5',
            "high":0,
            "medium":1,
            "low":0
          }
        ]);
        done();
      }
    };
    handler.filterNodes(req, res);
  });
  it('Example with concerns 01', (done) =>{
    const front_input = {
      conditions:[
        {conditionName:"concerns",operator:"IN",value:["2.1","2.2","3"]}
      ]
    };
    const req = {body:front_input};
    const res = {
      status: function (statusCode) {
        expect(statusCode).to.equal(200);
        return this;
      },
      send: function (responseBody){
        expect(responseBody).to.deep.equal([
         {
            "id":'5',
            "high":0,
            "medium":1,
            "low":0
          },
          {
            "id":'4',
            "high":1,
            "medium":0,
            "low":0
          },
          {
            "id":'7',
            "high":1,
            "medium":0,
            "low":0
          }
        ]);
        done();
      }
    };
    handler.filterNodes(req, res);
  });
  it('Example with concerns 02', (done) =>{
    const front_input = {
      conditions:[
        {conditionName:"concerns",operator:"IN",value:["1.1", "2.1", "3.1", "4", "5.1"]}
      ]
    };
    const req = {body:front_input};
    const res = {
      status: function (statusCode) {
        expect(statusCode).to.equal(200);
        return this;
      },
      send: function (responseBody){
        expect(responseBody).to.deep.equal([
          {
            "id":'5',
            "high":0,
            "medium":1,
            "low":0
          }
        ]);
        done();
      }
    };
    handler.filterNodes(req, res);
  });
  it('Example with concerns 03', (done) =>{
    const front_input = {
      conditions:[
        {conditionName:"concerns",operator:"IN",value:["1", "4", "5.1"]}
      ]
    };
    const req = {body:front_input};
    const res = {
      status: function (statusCode) {
        expect(statusCode).to.equal(200);
        return this;
      },
      send: function (responseBody){
        expect(responseBody).to.deep.equal([
          {
            "id":'5',
            "high":0,
            "medium":1,
            "low":0
          },
          {
            "id":'8',
            "high":0,
            "medium":0,
            "low":1
          }
        ]);
        done();
      }
    };
    handler.filterNodes(req, res);
  });
  it('Example with concerns 03', (done) =>{
    const front_input = {
      conditions:[
        {conditionName:"concerns",operator:"IN",value:["1", "4", "5.1"]}
      ]
    };
    const req = {body:front_input};
    const res = {
      status: function (statusCode) {
        expect(statusCode).to.equal(200);
        return this;
      },
      send: function (responseBody){
        expect(responseBody).to.deep.equal([
          {
            "id":'5',
            "high":0,
            "medium":1,
            "low":0
          },
          {
            "id":'8',
            "high":0,
            "medium":0,
            "low":1
          }
        ]);
        done();
      }
    };
    handler.filterNodes(req, res);
  });
  it('Mixed example with concerns', (done) =>{
    const front_input = {
      conditions:[
        {conditionName: 'risk_level' ,operator: 'GT', value: '4'},
        {conditionName: 'risk_level' ,operator: 'LT', value: '5'},
        {conditionName:"concerns",operator:"IN",value:["1", "4", "5.1"]}
      ]
    };
    const req = {body:front_input};
    const res = {
      status: function (statusCode) {
        expect(statusCode).to.equal(200);
        return this;
      },
      send: function (responseBody){
        expect(responseBody).to.deep.equal([
          {
            "id":'5',
            "high":0,
            "medium":1,
            "low":0
          }
        ]);
        done();
      }
    };
    handler.filterNodes(req, res);
  });
});

