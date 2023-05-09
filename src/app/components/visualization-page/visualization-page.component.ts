import { Component } from '@angular/core';
import * as d3 from "d3";


@Component({
  selector: 'app-visualization-page',
  templateUrl: './visualization-page.component.html',
  styleUrls: ['./visualization-page.component.scss']
})
export class VisualizationPageComponent {

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
  private data = {
    "nodes": this.nodes,
    "links": this.links
  }




  private data2 = [
    {"Framework": "Vue", "Stars": "166443", "Released": "2014"},
    {"Framework": "React", "Stars": "150793", "Released": "2013"},
    {"Framework": "Angular", "Stars": "62342", "Released": "2016"},
    {"Framework": "Backbone", "Stars": "27647", "Released": "2010"},
    {"Framework": "Ember", "Stars": "21471", "Released": "2011"},
  ];
  private svg: any;
  private margin = 50;
  private width = 750 - (this.margin * 2);
  private height = 400 - (this.margin * 2);

  ngOnInit(): void {
    //const svg = this.createSvg();
    //this.net()
    //this.drawBars(this.data);
  }

  private createSvg(): void {
    this.svg = d3.select("figure#bar")
      .append("svg")
      .attr("width", this.width + (this.margin * 2))
      .attr("height", this.height + (this.margin * 2))
      .append("g")
      .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
  }

  private drawNetwork() {
    const lines  =  this.svg.selectAll("line")
    .data(this.links)
    .enter()
    .append( "line" )
    .style( "stroke", "white" )
    .style( "stroke-width", 2 );

    const node  =  this.svg.selectAll("circle")
      .data(this.nodes)
      .enter()
      .append( "circle" )
      .attr( "r", 10 )
      .style( "fill", "orange");

// Tooltip
    node.append("title")
      .text(function( d: { name: any; } ) {
        return d.name;
      });

  }


  private drawBars(data: any[]): void {
    // Create the X-axis band scale
    const x = d3.scaleBand()
      .range([0, this.width])
      .domain(data.map(d => d.Framework))
      .padding(0.2);

    // Draw the X-axis on the DOM
    this.svg.append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Create the Y-axis band scale
    const y = d3.scaleLinear()
      .domain([0, 200000])
      .range([this.height, 0]);

    // Draw the Y-axis on the DOM
    this.svg.append("g")
      .call(d3.axisLeft(y));

    // Create and fill the bars
    this.svg.selectAll("bars")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d: any) => x(d.Framework))
      .attr("y", (d: any) => y(d.Stars))
      .attr("width", x.bandwidth())
      .attr("height", (d: any) => this.height - y(d.Stars))
      .attr("fill", "#d04a35");
  }

  private net() {
    const link = this.svg
      .selectAll("line")
      .data(this.links)
      .enter()
      .append("line")
      .style("stroke", "#aaa")

    const node = this.svg
      .selectAll("circle")
      .data(this.nodes)
      .enter()
      .append("circle")
      .attr("r", 20)
      .style("fill", "#69b3a2")

    node.append("title")
      .text(function( d: { name: string; } ) {
        return d.name;
      });

    function ticked() {
      link
        .attr("x1", function(d: { source: { x: any; }; }) { return d.source.x; })
        .attr("y1", function(d: { source: { y: any; }; }) { return d.source.y; })
        .attr("x2", function(d: { target: { x: any; }; }) { return d.target.x; })
        .attr("y2", function(d: { target: { y: any; }; }) { return d.target.y; });

      node
        .attr("cx", function (d: { x: number; }) { return d.x+6; })
        .attr("cy", function(d: { y: number; }) { return d.y-6; });
    }

    // @ts-ignore
    var simulation = d3.forceSimulation(this.nodes)                 // Force algorithm is applied to data.nodes
      .force("link", d3.forceLink()                               // This force provides links between nodes
        .id(function(d) { // @ts-ignore
          return d.id; })                     // This provide  the id of a node
        .links(this.links)                                    // and this the list of links
      )
      .force("charge", d3.forceManyBody().strength(-400))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
      .force("center", d3.forceCenter(this.width / 2, this.height / 2))     // This force attracts nodes to the center of the svg area
      .on("end", ticked);
  }

}
