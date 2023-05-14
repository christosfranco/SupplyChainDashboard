import {Component, Input, ViewEncapsulation} from '@angular/core';
import * as d3 from 'd3';
import * as d3dag from'd3-dag';
import { Node } from '../../model/node'

@Component({
  selector: 'app-dag-visualisation',
  encapsulation: ViewEncapsulation.None,  // Stops Angular from renaming class names in the CSS.
  // D3 generates it's own HTML which Angular doesn't know
  // about, so there is a mismatch between class names
  templateUrl: './dag-visualisation.component.html',
  styleUrls: ['./dag-visualisation.component.scss']
})



export class DagVisualisationComponent {

  constructor() { }
  @Input() public nodes: Node[] = []
  private highlightedNodesIds: String[] = []
  private dag: d3dag.Dag<{ id: string; parentIds: string[]; }, undefined> | undefined;
  private nodeRadius: any = 30;
  text: String | undefined
  private delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }


  ngOnInit(): void {
    this.highlightedNodesIds = ["1", "2"]
    this.createDag();
  }


  private createDag(): void {
    this.dag = d3dag.dagStratify()(this.nodes);
    const nodeRadius = this.nodeRadius
    const layout = d3dag
      .sugiyama()
      .layering(d3dag.layeringSimplex())
      .decross(d3dag.decrossOpt())
      .coord(d3dag.coordSimplex())
      .nodeSize((node) => [(node ? 3.6 : 0.25) * nodeRadius, 3 * nodeRadius]); // set node size instead of constraining to fit

    const svgSelection = d3.select('svg')
      .attr('width', '100%')
      .attr('height', '100%');

    // @ts-ignore
    layout(this.dag);

    const dag = this.dag;
    const svg = d3.select("svg");
    const zoomFn = d3.zoom()
      .scaleExtent([0.2, 10])
      .on('zoom', function handleZoom(event) {

      svg.selectAll('g.node-group').attr("transform", event.transform);
      const radius = nodeRadius / event.transform.k;

      svg.selectAll('g.node-group.nodes')
        .selectAll('circle')
        .attr('r', radius);

      svg.selectAll('g.node-group.highlight')
        .selectAll('circle')
        .attr('r', radius+10);

      svg.selectAll('g.node-group.nodes')
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
      // .curve(d3.curveStepBefore)     // @ts-ignore
      .curve(d3.curveCatmullRom.alpha(0.2))  // @ts-ignore   // set alpha to adjust control points
      .x((d) => 2*d.y) // @ts-ignore
      .y((d) => d.x);


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
      .attr("transform", ({x, y}) => `translate(${2*y}, ${x})`);

    nodes
      .append("rect")// @ts-ignore
      .attr("fill", (n) => "#77aad9")
      .attr('width', 96)
      .attr('height', 40)
      .style("stroke", d => "black")
      .style("stroke-width", d=> 1)// @ts-ignore
      .attr("transform", ({x, y}) => `translate(${-48}, ${-24})`);

    nodes
      .filter(d => d.data.id in this.highlightedNodesIds)
      .append("circle")
      .attr("class", "highlight")
      .attr("r", nodeRadius+35)
      .attr("fill", (n) => "none")
      .style("stroke", d => "yellow")
      .style("stroke-width", d=> 5);

    nodes
      .append("text")// @ts-ignore
      .text((d) => d.data.name)
      .attr("font-weight", "bold")
      .attr("font-family", "sans-serif")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("fill", "white")
      .attr("font-size", "12px");

    svg
      .selectAll("g")// @ts-ignore
      .attr("transform", ({x, y}) => `translate(${200}, ${0})`)
  }

  private highlightNodes() {
    const nodes = d3.select("svg")
      .selectAll('g.node-group.nodes')// @ts-ignore
      .filter(d => d.data.id in this.highlightedNodesIds)
      .append("circle")
      .attr("class", "highlight")
      .attr("r", this.nodeRadius+35)
      .attr("fill", (n) => "none")
      .style("stroke", d => "yellow")
      .style("stroke-width", d=> 5);
  }


  ngAfterViewInit() {
  }
}
