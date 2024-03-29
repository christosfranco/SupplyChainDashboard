const { expect } = require('chai');
const { calculateRiskLevel } = require('../controllers/riskLevelCalculateController');

describe('calculateRiskLevel', () => {
  it('should return the correct risk level for given consequence and likelihood values', () => {
    // Test case 1
    const riskLevel1 = calculateRiskLevel(4, 3);
    expect(riskLevel1).to.equal(3);

    // Test case 2
    const riskLevel2 = calculateRiskLevel(5, 2);
    expect(riskLevel2).to.equal(5);

    // Test case 3
    const riskLevel3 = calculateRiskLevel(2, 5);
    expect(riskLevel3).to.equal(5);

    // Test case 4
    const riskLevel4 = calculateRiskLevel(3, 3);
    expect(riskLevel4).to.equal(3);

    // Test case 5: Consequence and likelihood both low
    const riskLevel5 = calculateRiskLevel(1, 1);
    expect(riskLevel5).to.equal(1);

    // Test case 6: Consequence and likelihood both high
    const riskLevel6 = calculateRiskLevel(5, 5);
    expect(riskLevel6).to.equal(5);

    // Test case 7: Consequence low, likelihood high
    const riskLevel7 = calculateRiskLevel(1, 5);
    expect(riskLevel7).to.equal(3);

    // Test case 8: Consequence high, likelihood low
    const riskLevel8 = calculateRiskLevel(5, 1);
    expect(riskLevel8).to.equal(3);

    // Add more test cases as needed
  });
});
