import { Component, ViewEncapsulation  } from '@angular/core';
import * as d3 from 'd3';
import * as d3dag from'd3-dag';
import {NodesService} from "../../services/nodes.service";
import { Node } from '../../model/node'
import {hierarchy} from "d3-dag/dist/dag/create";

@Component({
  selector: 'app-dag-visualisation',
  encapsulation: ViewEncapsulation.None,  // Stops Angular from renaming class names in the CSS.
  // D3 generates it's own HTML which Angular doesn't know
  // about, so there is a mismatch between class names
  templateUrl: './dag-visualisation.component.html',
  styleUrls: ['./dag-visualisation.component.scss']
})



export class DagVisualisationComponent {

  constructor(private nodesService: NodesService) { }
  private nodes: Node[] = []
  private highlightedNodesIds: String[] = []
  private dag: d3dag.Dag<{ id: string; parentIds: string[]; }, undefined> | undefined;

  ngOnInit(): void {
    this.nodesService.getNodes().subscribe(nodes=> this.nodes = nodes);
    this.nodesService.getHighlights().subscribe(ids => this.highlightedNodesIds=ids)
    this.createDag();
  }

  private createDag(): void {
    const data = { id: "parent", children: [{ id: "child" }] };
    //const create = hierarchy();
    // @ts-ignore
    //const dag = create(data);
    this.dag = d3dag.dagStratify()(this.nodes);
    const nodeRadius = 30;
    const layout = d3dag
      .sugiyama()
      //.layering(d3dag.layeringSimplex())
      //.layering(d3dag.layeringTopological())
      //.coord(d3dag.coordTopological())
      .layering(d3dag.layeringSimplex())
      //.layering(d3dag.layeringLongestPath())
      .decross(d3dag.decrossOpt())
      //.decross(d3dag.decrossTwoLayer())
      //.coord(d3dag.coordGreedy())
      .coord(d3dag.coordSimplex())
      .nodeSize((node) => [(node ? 3.6 : 0.25) * nodeRadius, 3 * nodeRadius]); // set node size instead of constraining to fit

    const svgSelection = d3.select('svg')
      .attr('width', '100%')
      .attr('height', '100%');

    // @ts-ignore
    layout(this.dag);
  }
  ngAfterViewInit() {
    const dag = this.dag;
    const svg = d3.select("svg");
    const nodeRadius = 20;

    const zoomFn = d3.zoom().on('zoom', function handleZoom(event) {

      svg.selectAll('g.node-group').attr("transform", event.transform);
      const radius = nodeRadius / event.transform.k;

      svg.selectAll('g.node-group.nodes')
        .selectAll('circle')
        .attr('r', radius);

      svg.selectAll('g.node-group.highlight')
        .selectAll('circle')
        .attr('r', radius+10);

      svg.selectAll('g.node-group')
        .selectAll('text')
        .attr('font-size', 12 / event.transform.k);

      svg.selectAll('path.edge-path')
        .attr("transform", event.transform)
        .attr("stroke-width", 3 / event.transform.k);
    });

    // @ts-ignore
    svg.call(zoomFn);


    //curveCatmullRom
    const line = d3
      .line()
      .curve(d3.curveStepBefore)     // @ts-ignore
      .x((d) => d.x)     // @ts-ignore
      .y((d) => d.y);

    const edgePaths = svg
      .append("g")
      .attr("class", "edge-group")
      .selectAll("path")    // @ts-ignore
      .data(dag.links())
      .enter()
      .append("path")
      .attr("class", "edge-path")    // @ts-ignore
      .attr("d", ({points}) => line(points))
      .attr("fill", "none")
      .attr("stroke-width", 3)
      .attr("stroke", "black")
      .attr("transform", "translate(0, 0)");

    const nodes = svg
      .append("g")
      .attr("class", "node-group")
      .selectAll("g")    // @ts-ignore
      .data(dag.descendants())
      .enter()
      .append("g")
      .attr("class", "node")// @ts-ignore
      .attr("transform", ({x, y}) => `translate(${x}, ${y})`);

    //nodes
    //  .append("circle")
    //  .attr("class", "nodes")
    //  .attr("r", nodeRadius)
    //  .attr("fill", (n) => "blue");

    nodes
      .filter(d => d.data.id in this.highlightedNodesIds)
      .append("circle")
      .attr("class", "highlight")
      .attr("r", nodeRadius+35)
      .attr("fill", (n) => "none")
      .style("stroke", d => "yellow")
      .style("stroke-width", d=> 5);

    nodes
      .append("rect")// @ts-ignore
      .attr("fill", (n) => "#69a3b2")
      .attr('width', 96)
      .attr('height', 40)
      .style("stroke", d => "black")
      .style("stroke-width", d=> 1)// @ts-ignore
      .attr("transform", ({x, y}) => `translate(${-48}, ${-24})`);

    nodes
      .append("text")
      .attr("transform", ({x, y}) => `translate(${-48}, ${-24})`)
      .append("tspan")// @ts-ignore
      .text((d) => d.data.product)
      .attr("x", "48")
      .attr("dy", "1em")
      .attr("font-weight", "bold")
      .attr("font-family", "sans-serif")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("fill", "white")
      .attr("font-size", "10px");


    nodes
      .selectAll('text')
      .append("tspan")// @ts-ignore
      .text((d) => d.data.company)
      .attr("x", "48")
      .attr( "dy","1.4em")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("fill", "white")
      .attr("font-size", "10px")
      .attr("font-weight", "bold")
      .attr("font-family", "sans-serif");


    svg
      .selectAll("g")// @ts-ignore
      .attr("transform", ({x, y}) => `translate(${200}, ${0})`)
  }
}
