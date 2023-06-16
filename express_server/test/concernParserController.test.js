const { expect } = require('chai');
const {Concern, ConcernData} = require('../models/concernModel');
const {parseConcern, parseChildren, parseConcernData, resetConcernIDs} = require('../controllers/parserConcernController');


describe('Concern Model Parsing', () => {
  describe('parseConcern', () => {
    it('should parse a valid concern object', () => {
      resetConcernIDs();
      const jsonConcern = {
        Concern_ID: '1',
        Concern_name: 'Privacy',
        Children: [],
      };

      const concern = parseConcern(jsonConcern);

      expect(concern).to.be.an.instanceOf(Concern);
      expect(concern.Concern_ID).to.equal('1');
      expect(concern.Concern_name).to.equal('Privacy');
      expect(concern.Children).to.be.an('array').that.is.empty;
    });

    it('should return an error for invalid Concern_ID type', () => {
      resetConcernIDs();
      const jsonConcern = {
        Concern_ID: 1,
        Concern_name: 'Privacy',
        Children: [],
      };

      const result = parseConcern(jsonConcern);

      expect(result).to.be.an.instanceOf(Error);
      expect(result.message).to.equal("Invalid type for 'Concern_ID' field: 1");
    });

    it('should return an error for unexpected field', () => {
      resetConcernIDs();
      const jsonConcern = {
        Concern_ID: '1',
        Concern_name: 'Privacy',
        Children: [],
        UnexpectedField: 'Unexpected',
      };

      const result = parseConcern(jsonConcern);

      expect(result).to.be.an.instanceOf(Error);
      expect(result.message).to.equal("Unexpected field 'UnexpectedField' in Concern: 1");
    });
  });

  describe('parseChildren', () => {
    it('should parse an empty children array', () => {
      const jsonChildren = [];

      const children = parseChildren(jsonChildren);

      expect(children).to.be.an('array').that.is.empty;
    });

    it('should parse a valid children array', () => {
      const jsonChildren = [
        {
          Concern_ID: '1.1',
          Concern_name: 'Child Concern',
          Children: [],
        },
      ];

      const children = parseChildren(jsonChildren);

      expect(children).to.be.an('array').that.has.lengthOf(1);
      expect(children[0]).to.be.an.instanceOf(Concern);
      expect(children[0].Concern_ID).to.equal('1.1');
      expect(children[0].Concern_name).to.equal('Child Concern');
      expect(children[0].Children).to.be.an('array').that.is.empty;
    });

    it('should return an error for invalid children type', () => {
      const jsonChildren = {};

      const result = parseChildren(jsonChildren);

      expect(result).to.be.an.instanceOf(Error);
      expect(result.message).to.equal("Invalid type for 'Children' field: [object Object]");
    });
  });
  describe('parseConcernData', () => {
    it('should parse a valid concern data object', () => {
          const jsonData = {
            Concern_Trees: [
              {
                Concern_ID: '1',
                Concern_name: 'Privacy',
                Children: [
                  {
                    Concern_ID: "1.1",
                    Concern_name: "Personal information",
                    Children: []
                  }
                ],
              },
              {
                Concern_ID: '2',
                Concern_name: 'Reliability',
                Children: [],
              },
            ],
          };

          const concernData = parseConcernData(jsonData);

          expect(concernData).to.be.an.instanceOf(ConcernData);
          expect(concernData.Concern_Trees).to.be.an('array').with.lengthOf(2);

          const firstConcern = concernData.Concern_Trees[0];
          expect(firstConcern).to.be.an.instanceOf(Concern);
          expect(firstConcern.Concern_ID).to.equal('1');
          expect(firstConcern.Concern_name).to.equal('Privacy');
          expect(firstConcern.Children).to.be.an('array').with.lengthOf(1);

          const secondConcern = concernData.Concern_Trees[1];
          expect(secondConcern).to.be.an.instanceOf(Concern);
          expect(secondConcern.Concern_ID).to.equal('2');
          expect(secondConcern.Concern_name).to.equal('Reliability');
          expect(secondConcern.Children).to.be.an('array').that.is.empty;
        });

        it('should return an instance of Error for an invalid concern data object', () => {
          const jsonData = {
            Concern_Trees: [
              {
                Concern_ID: '1',
                Concern_name: 'Privacy',
                Children: [
                  {
                    Concern_ID: "1",
                    Concern_name: "Personal information",
                    Children: []
                  }
                ],
              },
              {
                Concern_ID: '2',
                Concern_name: 'Reliability',
                Children: [],
              },
            ],
          };

          const result = parseConcernData(jsonData);

          expect(result).to.be.an.instanceOf(Error);
        });

        it('should return an instance of Error if Concern_Trees is missing or not an array', () => {
          const jsonData = {
            Concern_Trees: 'Invalid',
          };

          const result = parseConcernData(jsonData);

          expect(result).to.be.an.instanceOf(Error);
     });
  });
});
