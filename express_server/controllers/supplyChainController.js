const Node = require('../models/node');
const SupplyChainTree = require('../models/supplyChainTree');
const parserController = require('./parserSupplyChainController');
const {of} = require("rxjs");

const getNodeDetails = (req, res) => {
/*
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
          'mitigationStrategy': ['Updating Firewall maybe??']
        },
        {
          'id': 6,
          'name': 'Access breach',
          'concern': ['Physical Security'],
          'description': 'Guards not attentive',
          'consequenceLevel': 1,
          'likelihoodLevel':3,
          'riskFactor': 4,
          'mitigationStrategy': ['Security Cameras']
        }
      ]}
  ];
  //res.send(data);
  */
  //console.log(req.params.nodeID);
  const requested_node_id = req.params.nodeID;
  const parsData = parserController.data.Nodes;
  let ret_struct = {};

  const map_name_backend_fontend = {
    "Node_ID"     :   "id",
    "Node_name"   :   "name",
    "Type"        :   "category",
    "Supplier"    :   "omit",
    "Risks"       :   "risks",
    "Risk"        :   "omit",
    "Name"        :   "name",
    "Risk_ID"     :   "id",
    "Consequence" :   "consequenceLevel",
    "Likelihood"  :   "likelihoodLevel",
    "Risk_Level"  :   "riskFactor",
    "Mitigation_Strategies" : "mitigationStrategy",
    "Concern_IDs" :   "concern", // TODO it needs to map concern_id's to actula concerns (text)!
    "Suppliers"   :   "omit"
  }
  function adjust_data_for_frontend(node, json_s) {
      let risk_sub_structure = [];
      let concern_sub_structure = ['TODO'];
      for (const key in node) {
        if(map_name_backend_fontend[key] === "omit")
          continue;
        else if(key === "Risks"){
          let all_risks = node[key];
          all_risks.forEach((risk) =>{
            let tmp_risk = {};
            for (const risk_key in risk){
              if(risk_key === "Concern_IDs"){
                //TODO
                tmp_risk[map_name_backend_fontend[risk_key]] = concern_sub_structure;
              }else{
                let tmp_value = risk[risk_key];
                if(risk_key === 'Risk_Level'){
                  tmp_value = risk.Consequence * risk.Likelihood;
                }
                if (typeof tmp_value === "number")
                    tmp_value.toString();
                tmp_risk[map_name_backend_fontend[risk_key]] = tmp_value;
              }
            }
            risk_sub_structure.push(tmp_risk);
          });
          json_s[map_name_backend_fontend[key]] = (risk_sub_structure);
        }else{
          let tmp_val = node[key];
          if (typeof tmp_val === "number")
            tmp_val.toString();
          json_s[map_name_backend_fontend[key]] = tmp_val;
        }
      }
    return [json_s];
  }

  let fstruct;
  parsData.forEach((node) => {
    if(node.Node_ID.toString() === requested_node_id){
      fstruct = adjust_data_for_frontend(node, ret_struct);
      return;
    }
  });
  console.log("Final struct is: ", fstruct);
  res.status(200).send(fstruct);
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

  const mapping_matrix =  [
    // flipped matrix to correspond to coordinate system
    ["L", "L", "L", "L", "M"],
    ["L", "L", "M", "M", "H"],
    ["L", "M", "M", "M", "H"],
    ["L", "M", "M", "H", "H"],
    ["M", "H", "H", "H", "H"],
  ];

  function custom_map(consequence, likelihood) {
      /*
      * Mapping is done based on picture in provided word document by customer
      * Label -> L = low, M = medium, H = high
      * x - axe corresponds to consequence and y - axe corresponds to likelihood
      * 4 [ M, H, H, H, H ]
      * 3 [ L, M, M, H, H ]
      * 2 [ L, M, M, M, H ]
      * 1 [ L, L, M, M, H ]
      * 0 [ L, L, L, L, M ]
      *   0  1  2  3  4
      * */
    //console.log("mapping between [row][column]", likelihood-1, consequence-1);
    switch (mapping_matrix[likelihood-1][consequence-1]) {
      case 'L':
        return "low";
        break;
      case 'M':
        return "medium";
        break;
      case 'H':
        return "high";
        break;
      default:
        break;
    }
    return undefined;
  }

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
    let mitigation_strategy_value = false;


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
          mitigation_strategy = true;
          mitigation_strategy_value = condition.value === 'yes';
          break;
        default:
          res.status(400).send("Error: Invalid option in conditionName!");
          break;
      }
      previous_name = tmp_name;
    });
    //console.log(concerns, risk_level, likelihood, risk_factor, mitigation_strategy);
    //console.log("Supply Chain Tree data: ", parserController.data);
    // console.log("Is mitigation strategy among conditions: ", mitigation_strategy, " mitigation strategy value is: ", mitigation_strategy_value);

    // Check if filtering requires filtering by risk_factor without both likelihood & risk_level
    if(risk_factor.length > 0 && (likelihood.length === 0 || risk_level.length === 0))
      res.send(500).send("Error: Cannot filter by risk_factor without both likelihood & risk_level!");

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
        if(!checkCondition(risk_level, is_risk_level_range, risk.Consequence) && risk_level.length !== 0)
          return;
        // check likelihood
        //console.log("********* check likelihood for", tmp_node_id, "**********");
        if(!checkCondition(likelihood, is_likelihood_range, risk.Likelihood) && likelihood.length !== 0)
          return;
        // check risk_factor
        //console.log("********* check risk_factor for", tmp_node_id, "**********");
        if(!checkCondition(risk_factor, is_risk_factor_range, (risk.Consequence * risk.Likelihood)) && risk_factor.length !== 0)
          return;
        //console.log("It proceed past risk_factor");
        // check mitigation strategy - if it applicable
        if(mitigation_strategy) {
          //console.log("It went to mitigation strategy?");
          if (mitigation_strategy_value && risk.Mitigation_Strategies.length === 0 ||
              !mitigation_strategy_value && risk.Mitigation_Strategies.length !== 0)
            return;
        }
        // check concerns TODO awaiting @Katrine & @Thomas
        tmp_condition = true;
      });
      if(tmp_condition)
        return_ids.push(tmp_node_id);
    });
    //console.log("Return IDs: ",return_ids);

    /*
        for each id that will be return go through its risk(s) and calculate
        how many of them is [high, medium, low] and at the same time create final structure
     */
    let finalFilterStructure = [];
    return_ids.forEach((node_id) => {
      const tmp_risks = parserController.data.Nodes.find(Node => Node.Node_ID === node_id).Risks;
      //console.log("tmp risks: ", tmp_risks);
      let hml = [0,0,0]; // [high, medium, low]
      if (tmp_risks.length !== 0){
        tmp_risks.forEach((risk) => {
            let likelihood_map = custom_map(risk.Consequence, risk.Likelihood);
            //console.log("Mapped likelihood: ", likelihood_map);
            if (likelihood_map === "low")
              hml[0]+=1;
            else if(likelihood_map === "medium")
              hml[1]+=1;
            else if(likelihood_map === "high")
              hml[2]+=1;
            else
              res.status(442).send("Error: Invalid option in likelihood_map!");
        });
        // append to the final structure
        finalFilterStructure.push({
          "id"      : node_id.toString(),
          "high"    : hml[2],
          "medium"  : hml[1],
          "low"     : hml[0]
        });
      }
    });
    //res.send(return_ids);
    // return final structure
    console.log("Filtering returns: ", finalFilterStructure);
    res.status(200).send(finalFilterStructure);
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
  getNodeDetails,
  filterNodes,
  uploadSupplyChain,
  uploadConcernTree
};
