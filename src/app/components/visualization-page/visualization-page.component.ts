import { Component, ViewChild } from '@angular/core';
import { Node } from "../../model/node";
import { NodesService } from "../../services/nodes.service";
import { DagVisualisationComponent } from "../dag-visualisation/dag-visualisation.component";
import { DetailsComponent } from "../details/details.component";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

@Component({
  selector: 'app-visualization-page',
  templateUrl: './visualization-page.component.html',
  styleUrls: ['./visualization-page.component.scss']
})
export class VisualizationPageComponent {
  @ViewChild(DagVisualisationComponent) graph: any;

  nodes: Node[] | undefined;
  highlightedNodesIds: String[] = [];

  constructor(private nodesService: NodesService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.nodesService.getNodes().subscribe(nodes => {
      this.nodes = nodes;
    });
    this.nodesService.getHighlights().subscribe(highlightedNodesIds => {
      this.highlightedNodesIds = highlightedNodesIds;
    });

  }
  openDialog(nodeId: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { nodeId };
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '40vw';
    dialogConfig.height = '60vh';
    dialogConfig.maxHeight = '90vh';
    dialogConfig.position = { top: '25vh', left: '35vw' };
    dialogConfig.panelClass = 'my-dialog';

    this.dialog.open(DetailsComponent, dialogConfig);
  }

  button(): void {
    this.graph.highlightNodes(this.highlightedNodesIds);
  }

  removeButton(): void {
    this.graph.removeHighlight();
  }

  onNodeClick(d: any) {
    this.openDialog(d);
  }
}
