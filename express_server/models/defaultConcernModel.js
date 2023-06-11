function DefaultConcernTree() {
  return {
    "Concern_Trees": [{
    "Concern_ID": "1",
    "Concern_name": "Privacy",
    "Children": [{
      "Concern_ID": "1.1",
      "Concern_name": "Personal information",
      "Children": []
    },
      {
        "Concern_ID": "1.2",
        "Concern_name": "Manipulation of phys. env.",
        "Children": []
      }
    ]
  },
    {
      "Concern_ID": "2",
      "Concern_name": "Reliability",
      "Children": [{
        "Concern_ID": "2.1",
        "Concern_name": "Stable performance",
        "Children": []
      },
        {
          "Concern_ID": "2.2",
          "Concern_name": "Predictable performance",
          "Children": []
        }
      ]
    },
    {
      "Concern_ID": "3",
      "Concern_name": "Resilience",
      "Children": [{
        "Concern_ID": "3.1",
        "Concern_name": "Unexpected conditions",
        "Children": []
      },
        {
          "Concern_ID": "3.2",
          "Concern_name": "Instability",
          "Children": []
        }
      ]
    },
    {
      "Concern_ID": "4",
      "Concern_name": "Safety",
      "Children": []
    },
    {
      "Concern_ID": "5",
      "Concern_name": "Security",
      "Children": [{
        "Concern_ID": "5.1",
        "Concern_name": "Confidentiality",
        "Children": []
      },
        {
          "Concern_ID": "5.2",
          "Concern_name": "Integrity",
          "Children": []
        },
        {
          "Concern_ID": "5.3",
          "Concern_name": "Availability",
          "Children": []
        }
      ]
    }
  ]
  }
}

module.exports = {
  DefaultConcernTree
};

