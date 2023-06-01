import { Component, ViewChild } from '@angular/core';
import { Node } from "../../model/node";
import { NodesService } from "../../services/nodes.service";
import { DagVisualisationComponent } from "../dag-visualisation/dag-visualisation.component";
import { DetailsComponent } from "../details/details.component";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import {ModalService} from "../../services/modal.service";

@Component({
  selector: 'app-visualization-page',
  templateUrl: './visualization-page.component.html',
  styleUrls: ['./visualization-page.component.scss']
})

export class VisualizationPageComponent {
  @ViewChild(DagVisualisationComponent) graph: any;
  public imageUrl_edit = "../../assets/images/edit.png";
  public imageUrl_trash = "../../assets/images/trash.png";
  public imageUrl_attention = "../../assets/images/attention.png";



  nodes: Node[] | undefined;
  highlightedNodesIds: String[] = [];

  constructor(private nodesService: NodesService, private dialog: MatDialog,
              private modalService: ModalService) {

    this.filters = FILTERS_EXAMPLE;
  }

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

  openModal(id: string) {
    this.modalService.open(id)
  }

  closeModal(id: string) {
    this.modalService.close(id)
  }

  noFiltersMsg = false;

  public hideApplied() {
    const appliedFilters = document.getElementById("applied-filters");
    appliedFilters!.hidden = true;
  }
  public filters: Filter[] | undefined;

  public showApplied() {
    if (this.filters?.length) {
      const appliedFilters = document.getElementById("applied-filters");
      appliedFilters!.hidden = false;
    } else {
      this.noFiltersMsg = true;
      setTimeout(() => {
        this.noFiltersMsg = false;
      }, 2000);
    }
  }
}

interface Filter {
  id: string;
  name: string;
  color: string;
  concerns: null | string[];
  risks: null | string[];
  risk_level: null | number[];
  likelihood: null | number[];
  risk_factor: null | number[];
  mitigation_strategy: null | boolean;
}


const FILTERS_EXAMPLE = [
  {
    "id": "1",
    "name": "This is long filter name",
    "color": "#DEB92AFF",
    "concerns": ["1"],
    "risks": null,
    "risk_level": null,
    "likelihood": null,
    "risk_factor": null,
    "mitigation_strategy": null
  },
  {
    "id": "2",
    "name": "Filter2",
    "color": "#3FCFDCFF",
    "concerns": ["2"],
    "risks": null,
    "risk_level": null,
    "likelihood": null,
    "risk_factor": null,
    "mitigation_strategy": null
  }
]


