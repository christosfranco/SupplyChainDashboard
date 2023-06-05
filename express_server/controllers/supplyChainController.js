const Node = require('../models/node');
const SupplyChainTree = require('../models/supplyChainTree');
const parserController = require('./parserController');

const getNodes = (req, res) => {
  /*
  * Expected input: /
  * Expected response:
        [
          {
            "id": "1",
            "name": "booking.com",
            "parentIds": [
              "2",
              "3"
            ]
          }
        ]
  */

  const data = [
    {
      "id": "0",
      "name":"Hotel",
      "parentIds": []
    },
    {
      "id": "1",
      "name":"Website",
      "parentIds": ["0"]
    }
    ,
    {
      "id": "2",
      "name":"Booking Site",
      "parentIds": ["0"]
    },
    {
      "id": "3",
      "name":"Booking Site",
      "parentIds": ["0"]
    },
    {
      "id": "4",
      "name":"Server",
      "parentIds": ["1"]
    },
    {
      "id": "5",
      "name":"Firewall",
      "parentIds": ["4"]
    },
    {
      "id": "6",
      "name":"Physical Security",
      "parentIds": ["4"]
    },
    {
      "id": "7",
      "name":"Work Scheduler",
      "parentIds": ["0"]
    },
    {
      "id": "8",
      "name":"Cleaning Supply",
      "parentIds": ["0"]
    }
  ]
  res.send(data);
};

const getNodeDetails = (req, res) => {
  /*
    * Expected input: node_id
    * Expected response:
          [
              {
                "id": "1",
                "name": "booking.com",
                "category": "Booking Software",
                "risks": [
                  {
                    "id": "5",
                    "name": "IT Security",
                    "concern": [
                      "CyberSecurity",
                      "Privacy"
                    ],
                    "description": "Firewall Security Outdated",
                    "consequenceLevel": 1,
                    "likelihoodLevel": 3,
                    "riskFactor": 3,
                    "mitigationStrategy": "Updating Firewall maybe??"
                  }
                ]
              }
          ]
*/
  const data= [
    {'id':1, 'name': 'booking.com', 'category': 'Booking Software', 'risks': [
        {
          'id': 5,
          'name': 'IT Security',
          'concern': ['CyberSecurity', 'Privacy'],
          'description': 'Firewall Security Outdated',
          'consequenceLevel': 1,
          'likelihoodLevel':3,
          'riskFactor': 3,
          'mitigationStrategy': 'Updating Firewall maybe??'
        }
      ]}
  ];
  res.send(data);
};

const checkCondition = (array, is_in_range, inspect_value) => {
  //console.log("Parameters: ", array, is_in_range, inspect_value);
  if (array.length === 0) return true;
  if (is_in_range){
    //console.log("Is in range");
    return inspect_value >= array[0] && inspect_value <= array[1];
  }
  //console.log("check if it is the same");
  return inspect_value == array[0];
}
const filterNodes = (req, res) => {
  const body_json = req.body['conditions'];
  if(!body_json){
    console.log("waiting for filter conditions...");
    //res.status(100).send("Waiting for filter conditions...");
  }else {
    //console.log("it is not!");
    //}

    // Determine if we deal with range or specific value
    let is_risk_level_range = false;
    let is_likelihood_range = false;
    let is_risk_factor_range = false;

    // Arrays to store range (or value)
    let concerns = [];
    let risk_level = [];
    let likelihood = [];
    let risk_factor = [];
    let mitigation_strategy = false;


    // concerns are not yet relevant TODO awaiting @Katrine and @Thomas
    let previous_name = '';
    body_json.forEach((condition) => {
      const tmp_name = condition.conditionName;
      if (tmp_name === previous_name) {
        // determine which range is in play
        switch (tmp_name) {
          case 'risk_level':
            is_risk_level_range = true;
            break;
          case 'likelihood':
            is_likelihood_range = true;
            break;
          case 'risk_factor':
            is_risk_factor_range = true;
            break;
          default:
            res.status(400).send("Error: Invalid option in conditionName!");
            break;
        }
      }
      // fill in the values in the arrays/variables
      switch (tmp_name) {
        case 'concerns':
          concerns = condition.value;
          break;
        case 'risk_level':
          risk_level.push(condition.value);
          break;
        case 'likelihood':
          likelihood.push(condition.value);
          break;
        case 'risk_factor':
          risk_factor.push(condition.value);
          break;
        case 'mitigation':
          mitigation_strategy = condition.value === 'yes';
          break;
        default:
          res.status(400).send("Error: Invalid option in conditionName!");
          break;
      }
      previous_name = tmp_name;
    });
    // console.log(concerns, risk_level, likelihood, risk_factor, mitigation_strategy);
    //console.log("Supply Chain Tree data: ", parserController.data);
    // Iterate over nodes to find return id's
    let return_ids = [];
    const parsData = parserController.data.Nodes;
    parsData.forEach((node) => {
      const tmp_node_id = node.Node_ID;
      // if this will be true at the end of loop then node satisfies all conditions and is added to return array
      let tmp_condition = false;
      (node.Risks).forEach((risk) => {
        if(tmp_condition) // do not loop if it is not necessary anymore
          return;
        // check risk level
        //console.log("********* check risk_level for", tmp_node_id, "**********");
        if(!checkCondition(risk_level, is_risk_level_range, risk.Consequence))
          return;
        // check likelihood
        //console.log("********* check risk_level for", tmp_node_id, "**********");
        if(!checkCondition(likelihood, is_likelihood_range, risk.Likelihood))
          return;
        // check risk_factor
        //console.log("********* check risk_level for", tmp_node_id, "**********");
        if(!checkCondition(risk_factor, is_risk_factor_range, (risk.Consequence * risk.Likelihood)))
          return;
        // check mitigation strategy - if it applicable
        if(mitigation_strategy) {
          if (risk.Mitigation_Strategies.length === 0)
            return;
        }
        // check concerns TODO awaiting @Katrine & @Thomas
        tmp_condition = true;
      });
      if(tmp_condition)
        return_ids.push(tmp_node_id);
    });
    //console.log("I have this ids for return:", return_ids);
    res.send(return_ids);
  }
};

const uploadSupplyChain = (req, res) => {
  /*
  * Upload is JSON format from architecture document
  * No response
  * */
  res.sendStatus(200);
};

const uploadConcernTree = (req, res) => {
  res.sendStatus(200)
  /*
  * Upload is JSON format from architecture document
  * No response
  * */
};

module.exports = {
  getNodes,
  getNodeDetails,
  filterNodes,
  uploadSupplyChain,
  uploadConcernTree
};
