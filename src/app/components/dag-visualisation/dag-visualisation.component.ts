import { Component, ViewEncapsulation  } from '@angular/core';
import * as d3 from 'd3';
import * as d3dag from'd3-dag';

//Defines an interface to pairs of links
interface LinkPairs {
  source: string;
  target: string;
}

@Component({
  selector: 'app-dag-visualisation',
  encapsulation: ViewEncapsulation.None,  // Stops Angular from renaming class names in the CSS.
  // D3 generates it's own HTML which Angular doesn't know
  // about, so there is a mismatch between class names
  templateUrl: './dag-visualisation.component.html',
  styleUrls: ['./dag-visualisation.component.scss']
})



export class DagVisualisationComponent {

  private nodes = [
    {
      "id": 1,
      "name": "A"
    },
    {
      "id": 2,
      "name": "B"
    }
  ];

  private links = [
    {
      "source": 1,
      "target": 2
    }
  ];
  private data2 = {
    "nodes": this.nodes,
    "links": this.links
  }

  private data3 = [
    {
      "id": "0",
      "parentIds": ["8"]
    },
    {
      "id": "8",
      "parentIds": []
    }]

  private data = [
    {
      "id": "0",
      "parentIds": ["8"]
    },
    {
      "id": "1",
      "parentIds": []
    },
    {
      "id": "2",
      "parentIds": []
    },
    {
      "id": "3",
      "parentIds": ["11"]
    },
    {
      "id": "4",
      "parentIds": ["12"]
    },
    {
      "id": "5",
      "parentIds": ["18"]
    },
    {
      "id": "6",
      "parentIds": ["9", "15", "17"]
    },
    {
      "id": "7",
      "parentIds": ["3", "17", "20", "21"]
    },
    {
      "id": "8",
      "parentIds": []
    },
    {
      "id": "9",
      "parentIds": ["4"]
    },
    {
      "id": "10",
      "parentIds": ["16", "21"]
    },
    {
      "id": "11",
      "parentIds": ["2"]
    },
    {
      "id": "12",
      "parentIds": ["21"]
    },
    {
      "id": "13",
      "parentIds": ["4", "12"]
    },
    {
      "id": "14",
      "parentIds": ["1", "8"]
    },
    {
      "id": "15",
      "parentIds": []
    },
    {
      "id": "16",
      "parentIds": ["0"]
    },
    {
      "id": "17",
      "parentIds": ["19"]
    },
    {
      "id": "18",
      "parentIds": ["9"]
    },
    {
      "id": "19",
      "parentIds": []
    },
    {
      "id": "20",
      "parentIds": ["13"]
    },
    {
      "id": "21",
      "parentIds": []
    }
  ]
  private dag: d3dag.Dag<{ id: string; parentIds: string[]; }, undefined> | undefined;

  ngOnInit(): void {
    this.create_dag();
  }


  private create_dag() {
    this.dag = d3dag.dagStratify()(this.data);
    const dag = d3dag.dagStratify()(this.data);
    const nodeRadius = 20;
    const layout = d3dag
      .sugiyama() // base layout
      .decross(d3dag.decrossOpt()) // minimize number of crossings
      .nodeSize((node) => [(node ? 3.6 : 0.25) * nodeRadius, 3 * nodeRadius]); // set node size instead of constraining to fit

    const svgSelection = d3.select("svg")
      .attr("width", "100%")
      .attr("height", "100%");
    // @ts-ignore
    layout(this.dag);


    const line = d3
      .line()
      .curve(d3.curveCatmullRom)// @ts-ignore
      .x((d) => d.x)// @ts-ignore
      .y((d) => d.y);

    // Plot edges
    svgSelection
      .append("g")
      .selectAll("path")
      .data(this.dag.links())
      .enter()
      .append("path")// @ts-ignore
      .attr("d", ({points}) => line(points))
      .attr("fill", "none")
      .attr("stroke-width", 3)
      .attr("stroke", "black")

    // Select nodes
    const nodes = svgSelection
      .append("g")
      .selectAll("g")
      .data(this.dag.descendants())
      .enter()
      .append("g")
      .attr("transform", ({x, y}) => `translate(${x}, ${y})`);

    // Plot node circles
    nodes
      .append("circle")
      .attr("r", nodeRadius)
      .attr("fill", (n) => "blue");
    nodes
      .append("text")
      .text((d) => d.data.id)
      .attr("font-weight", "bold")
      .attr("font-family", "sans-serif")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("fill", "white");
  }

  ngAfterViewInit() {

    const dag = this.dag
    const svg = d3.select("svg");
    const zoomFn = d3.zoom().on('zoom', function handleZoom(event, ) {
      svg.selectAll('g').attr("transform", event.transform)
      console.log(event.transform.x)
      const nodes = svg
        .append("g")
        .selectAll("g")// @ts-ignore
        .data(dag.descendants())
        .enter()
        .append("g")
        .attr("transform", ({x, y}) => `translate(${ (event.transform.x + x) /event.transform.k}, ${(event.transform.y + y) /event.transform.k})`)

      // Plot node circles
      nodes
        .append("circle")
        .attr("r", 20)
        .attr("fill", (n) => "blue");
    });
    // @ts-ignore
    svg.call(zoomFn);

  }
}



