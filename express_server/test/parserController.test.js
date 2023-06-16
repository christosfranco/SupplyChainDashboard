const { expect, assert } = require('chai');
const { Risk, Node, parseNode, parseRisks, parseRisk, checkTypeArray, checkType } = require('../controllers/parserSupplyChainController');
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
        "Risks": [
          {
            "Name": "Risk 1",
            "Risk_ID": 5,
            "Consequence": 5,
            "Likelihood": 5,
            "Mitigation_Strategies": ["Security Cameras"],
            "Concern_IDs": [
              "1.2"
            ]
          }
        ]
      }
      ]
    }
    // end json
    ;
  });

  it('should return a valid Node object', () => {
    const node = parseNode(mockJsonNodes.Nodes[0]);
    expect(node).to.be.instanceOf(Node);

  });

  it('should return an array of valid Risk objects', () => {
    const risks = parseRisks(mockJsonNodes.Nodes[0].Risks);
    expect(risks).to.be.an('array');
    risks.forEach(risk => {
      expect(risk).to.be.instanceOf(Risk);
    });
  });

  it('should return a valid Risk object', () => {
    const risk = parseRisk(mockJsonNodes.Nodes[0].Risks[0]);
    expect(risk).to.be.instanceOf(Risk);
  });

  it('should return true for a valid array', () => {
    const array1 = ['value1', 'value2', 'value3'];
    const arrayEmpty = [];
    const resultEmpty = checkTypeArray(arrayEmpty, "hi");
    const result1 = checkTypeArray(array1, "hi");
    assert.strictEqual(resultEmpty, true, 'Empty array is valid');
    assert.strictEqual(result1, true, 'String array is valid');

    // ...
  });

  it('should return false for an invalid array', () => {
    const arrayEmptyString = ['', 'value2', 'value3'];
    const arrayEmptyString2 = ['s', 'value2', ''];
    const arrayEmptyString3 = [''];
    const number = 1;
    const stringEmpty = "";
    const string = "hi";
    const bool = true;
    const nan = NaN;
    const Null = null;

    const allArrays = [arrayEmptyString,arrayEmptyString2,arrayEmptyString3,number, stringEmpty,string, bool, nan,Null];
    for (const array in allArrays) {
        const res = checkTypeArray(array, "hi");
        assert.instanceOf(res, Error);

    }
  });

  it('should return true for a valid value', () => {
    const value = 123;
    const result = checkType(value, 1);
    expect(result).to.be.undefined;
  });
});
