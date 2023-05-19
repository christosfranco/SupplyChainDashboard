const Node = require('../models/node');
const SupplyChainTree = require('../models/supplyChainTree');

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

const filterNodes = (req, res) => {
  /*
  * Expected input: node_id
        [
            {
              "name": "LikelihoodFilter",
              "operator": "EQ",
              "condition": "5"
            },
            {
              "name": "ConcernFilter",
              "operator": "IN",
              "condition": [
                "CyberSecurity",
                "Resilience"
              ]
            }
        ]
  * Expected response: (id's of nodes that are filtered out??)
        [
          "1",
          "2"
        ]
*/
  res.send(["1", "2"])
};

const uploadSupplyChain = (req, res) => {
  /*
  * Upload is JSON format from architecture document
  * No response
  * */
  res.sendStatus(200);
};

const uploadConcernTree = (req, res) => {
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
