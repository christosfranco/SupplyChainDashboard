import {Component, ViewChild} from '@angular/core';
import {Node} from "../../model/node";
import {NodesService} from "../../services/nodes.service";
import {DagVisualisationComponent} from "../dag-visualisation/dag-visualisation.component";

@Component({
  selector: 'app-visualization-page',
  templateUrl: './visualization-page.component.html',
  styleUrls: ['./visualization-page.component.scss']
})
export class VisualizationPageComponent {

  @ViewChild(DagVisualisationComponent) graph: any;

  nodes: Node[] | undefined
  highlightedNodesIds: String[] = []

  constructor(private nodesService: NodesService) { }

  ngOnInit(): void {
    this.nodesService.getNodes().subscribe(nodes=> {
      this.nodes = nodes;
    });
    this.nodesService.getHighlights().subscribe(highlightedNodesIds=> {
      this.highlightedNodesIds = highlightedNodesIds;
    });
  }

  button(): void {
    this.graph.highlightNodes(this.highlightedNodesIds)
  }

  removeButton(): void {
    this.graph.removeHighlight()
  }

}
