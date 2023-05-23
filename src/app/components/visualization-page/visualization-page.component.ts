import { Component, ViewChild } from '@angular/core';
import { Node } from "../../model/node";
import { NodesService } from "../../services/nodes.service";
import { DagVisualisationComponent } from "../dag-visualisation/dag-visualisation.component";
import { DetailsComponent } from "../details/details.component";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import {ModalService} from "../modal/modal.service";
import {FilterService} from "../../services/filter.service";
import {Filter} from "../../model/filters";
import {FilterComponent} from "../filter/filter.component";

@Component({
  selector: 'app-visualization-page',
  templateUrl: './visualization-page.component.html',
  styleUrls: ['./visualization-page.component.scss']
})

export class VisualizationPageComponent {
  @ViewChild(DagVisualisationComponent) graph: any;
  @ViewChild(FilterComponent) filterForm: any;

  public imageUrl_edit = "../../assets/images/edit.png";
  public imageUrl_trash = "../../assets/images/trash.png";
  public imageUrl_attention = "../../assets/images/attention.png";

  nodes: Node[] | undefined;
  filters: Filter[] = [];

  constructor(private nodesService: NodesService, private dialog: MatDialog,
              private modalService: ModalService, private filterService: FilterService) {}

  ngOnInit(): void {
    this.nodesService.getNodes().subscribe(nodes => {
      this.nodes = nodes;
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

  handleFilterSelected(selectedFilters: Filter) {
    const color = selectedFilters.color;
    this.graph.removeHighlight(color);
    this.filterService
      .filterNodes(JSON.parse(JSON.stringify(selectedFilters)))
      .subscribe(
        (response: any) => this.graph.highlightNodes(response, color));
    this.filters?.push(selectedFilters);
  }
  // handleClearFilters($event: void) + to add to html (clearFilters)="handleClearFilters($event)"
  handleClearFilters(color:string) {
      this.graph.removeHighlight(color);
      this.filters = this.filters.filter(filter => filter.color !== color);
  }

  onNodeClick(d: any) {
    this.openDialog(d);
  }

  openModal(id: string) {
    this.modalService.open(id)
  }

  editFilters(id: string, selectedFilters: Filter): void{
    this.modalService.open(id)
    this.filters = this.filters.filter(filter => filter.name !== selectedFilters.name);
    this.filterForm.populateFilters(selectedFilters)
  }

  closeModal(id: string) {
    this.modalService.close(id)
  }

  noFiltersMsg = false;

  public hideApplied() {
    const appliedFilters = document.getElementById("applied-filters");
    appliedFilters!.hidden = true;
  }

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
