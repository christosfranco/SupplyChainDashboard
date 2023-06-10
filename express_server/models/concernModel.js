
function Concern() {
  this.Concern_ID = "0";
  this.Concern_name = "";
  this.Children = [];
}

function ConcernData() {
  this.Concern_Trees = [];
}

module.exports = {
  Concern,
  ConcernData,
};
