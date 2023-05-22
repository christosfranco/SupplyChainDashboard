const { expect, assert } = require('chai');
const { Risk, Node, parseNode, parseRisks, parseRisk, checkTypeArray, checkType } = require('../controllers/parserController');
// const {assert} = require('assert');
// const {strictEqual} = require('chai').assert;
describe('Nodes and Risk Parsing', () => {
  let mockJsonNodes;

  beforeEach(() => {
    mockJsonNodes =
      // start json
      {
      "Nodes": [
      {
        "Node_ID": 1,
        "Node_name": "Node 1",
        "Type": "Type A",
        "Suppliers": [],
        "Risks": []
      }
      ]
    }
    // end json
    ;
  });

  it('should return a valid Node object', () => {
    const node = parseNode(mockJsonNodes.Nodes[0]);
    expect(node).to.be.instanceOf(Node);
    // Add more assertions to validate the parsed Node object
    // ...
  });

  it('should return an array of valid Risk objects', () => {
    const risks = parseRisks(mockJsonNodes.Nodes[0].Risks);
    expect(risks).to.be.an('array');
    risks.forEach(risk => {
      expect(risk).to.be.instanceOf(Risk);
      // Add more assertions to validate the parsed Risk objects
      // ...
    });
  });

  it('should return a valid Risk object', () => {
    const risk = parseRisk(mockJsonNodes.Nodes[0].Risks[0]);
    expect(risk).to.be.instanceOf(Risk);
    // Add more assertions to validate the parsed Risk object
    // ...
  });

  it('should return true for a valid array', () => {
    // const array = ['value1', 'value2', 'value3'];
    const array = [];
    const result = checkTypeArray(array, "hi");
    // Add more assertions for different scenarios
    assert.strictEqual(result, true, 'The value is not equal to 1');

    // ...
  });

  it('should return true for a valid value', () => {
    const value = 123;
    const result = checkType(value, 1);
    expect(result).to.be.undefined;
    // Add more assertions for different scenarios
    // ...
  });
});
