import { Component } from '@angular/core';
import {Node} from "../../model/node";
import {NodesService} from "../../services/nodes.service";

@Component({
  selector: 'app-visualization-page',
  templateUrl: './visualization-page.component.html',
  styleUrls: ['./visualization-page.component.scss']
})
export class VisualizationPageComponent {

  nodes: Node[] | undefined
  highlightedNodesIds: String[] = []

  constructor(private nodesService: NodesService) { }

  ngOnInit(): void {
    this.nodesService.getNodes().subscribe(nodes=> {
      console.log(nodes)
      console.log("Done")
      this.nodes = nodes;
    });
    this.nodesService.getHighlights().subscribe(highlightedNodesIds=> {
      this.highlightedNodesIds = highlightedNodesIds;
    });
  }

}
