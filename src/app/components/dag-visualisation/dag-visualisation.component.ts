import {Component, Inject, ElementRef, EventEmitter, Input, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import * as d3 from 'd3';
import * as d3dag from'd3-dag';
import { Node } from '../../model/node'
import { DOCUMENT } from "@angular/common";
import * as htmlToImage from "html-to-image";

@Component({
  selector: 'app-dag-visualisation',
  encapsulation: ViewEncapsulation.None,  // Stops Angular from renaming class names in the CSS.
  // D3 generates it's own HTML which Angular doesn't know
  // about, so there is a mismatch between class names
  templateUrl: './dag-visualisation.component.html',
  styleUrls: ['./dag-visualisation.component.scss']
})



export class DagVisualisationComponent {

  constructor(@Inject(DOCUMENT) private coreDoc: Document) { }

  @ViewChild("dagChart") downloadEl: ElementRef | undefined;
  @Input() public nodes: Node[] = []
  @Output() nodeClick: EventEmitter<any> = new EventEmitter<any>();

  private dag: d3dag.Dag<{ id: string; parentIds: string[]; }, undefined> | undefined;
  private nodeRadius: any = 30;
  text: String | undefined

  ngOnInit(): void {
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
      .attr("transform", ({x, y}) => `translate(${2*y}, ${x})`)
      .on("click", (event, d) => {
        this.nodeClick.emit(d.data.id);
      });

    nodes
      .append("rect")// @ts-ignore
      .attr("fill", (n) => "#77aad9")
      .attr('width', 96)
      .attr('height', 40)
      .style("stroke", d => "black")
      .on("mouseenter", (event, d) => {
        d3.select(event.currentTarget).style("cursor", "pointer");
        d3.select(event.currentTarget).style("fill", "#5d9ad2");
      })
      .on("mouseleave", (event, d) => {
        d3.select(event.currentTarget).style("cursor", "default");
        d3.select(event.currentTarget).style("fill", "#77aad9");
      })
      .style("stroke-width", d=> 1)// @ts-ignore
      .attr("transform", ({x, y}) => `translate(${-48}, ${-24})`);

    nodes
      .append("text")// @ts-ignore
      .text((d) => d.data.name)
      .attr("font-weight", "bold")
      .attr("font-family", "sans-serif")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("fill", "white")
      .attr("font-size", "12px");

  }

  public highlightNodes(highlightedNodesIds: string[]) {

    const r = this.nodeRadius

    d3.select("svg")
      .selectAll('.node')// @ts-ignore
      .filter((d) => highlightedNodesIds.includes(d.data.id))// @ts-ignore
      .each(this.displayRiskColors)

    d3.select("svg")
      .selectAll('.node')// @ts-ignore
      .filter((d) => highlightedNodesIds.includes(d.data.id))// @ts-ignore
  }

  public removeHighlight() {
    const nodes = d3.select("svg")
      .selectAll('.highlight')
      .remove();
  }

  private displayRiskColors(d:any) {
    console.log(d.data.id)
    let colors = ["green", "orange", "red"]
    let risks = [5,10,15]
    for (let i:number = 0;i<risks.length;i++) {
      // @ts-ignore
      const highlights = d3.select(this)
        .append("g")
        .attr("class", "highlight")// @ts-ignore
        .attr("transform", ({x, y}) => `translate(${-48+(i*33)}, ${-38})`)

      highlights
        .append("rect")
        .attr("fill", (n) => colors[i])
        .attr('width', 30)
        .attr('height', 10)
        .style("stroke", d => "black")
        .style("stroke-width", d => 1)

      highlights
        .append("text")
        .text((d) => risks[i])
        .attr("fill", "white")
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")// @ts-ignore
        .attr("transform", ({x, y}) => `translate(${15}, ${9})`)
        .attr("font-weight", "bold")
        .attr("font-family", "sans-serif")
    }
  }

  downloadDataUrl(dataUrl: string, filename: string): void {
    var a = this.coreDoc.createElement("a");
    a.href = dataUrl;
    a.download = filename;
    this.coreDoc.body.appendChild(a);
    a.click();
    this.coreDoc.body.removeChild(a);
  }

  downloadSvgAsPng(): void {
    const theElement = this.downloadEl?.nativeElement;
    htmlToImage.toPng(theElement, {backgroundColor: "#FFFFFF"}).then(dataUrl => {
      this.downloadDataUrl(dataUrl, "supply-chain.png");
    });
  }
}

