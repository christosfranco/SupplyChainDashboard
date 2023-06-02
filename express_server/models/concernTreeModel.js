
function ConcernTree() {
  this.SubConcernTree = [];
}


let concernTreeDefault = new ConcernTree();

concernTreeDefault = [
  {
    concern: "Concern1",
    id: "1",
    subconcerns: [
      {
        concern: "Concern1.1",
        id: "1.1",
        subconcerns: []
      },
      {
        concern: "Concern1.2",
        id: "1.2",
        subconcerns: [
          {
            concern: "Concern1.2.1",
            id: "1.2.1",
            subconcerns: []
          },
          {
            concern: "Concern1.2.2",
            id: "1.2.2",
            subconcerns: [
              {
                concern: "Concern1.2.2.1",
                id: "1.2.2.1",
                subconcerns: []
              },
              {
                concern: "Concern1.2.2.2",
                id: "1.2.2.2",
                subconcerns: []
              }
            ]
          }
        ]
      },
      {
        concern: "Concern1.3",
        id: "1.3",
        subconcerns: []
      }
    ]
  },
  {
    concern: "Concern2",
    id: "2",
    subconcerns: [
      {
        concern: "Concern2.1",
        id: "2.1",
        subconcerns: []
      },
      {
        concern: "Concern2.2",
        id: "2.2",
        subconcerns: []
      }]
  },
  {
    concern: "Concern3",
    id: "3",
    subconcerns: [
      {
        concern: "Concern4",
        id: "4",
        subconcerns: []
      }]
  }
];


module.exports =  {
  concernTreeDefault,
}
