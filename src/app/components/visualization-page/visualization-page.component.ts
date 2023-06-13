import { Component, ViewChild } from '@angular/core';
import {Node, NodeRisks} from "../../model/node";
import { NodesService } from "../../services/nodes.service";
import { DagVisualisationComponent } from "../dag-visualisation/dag-visualisation.component";
import { DetailsComponent } from "../details/details.component";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import {FilterService} from "../../services/filter.service";
import {ConcernForest, Filter} from "../../model/filters";
import {FilterComponent} from "../filter/filter.component";
import {AppliedFiltersComponent} from "../applied-filters/applied-filters.component";
import {ModalService} from "../../services/modal.service";
import {Concerns} from "../../model/concerns";


@Component({
  selector: 'app-visualization-page',
  templateUrl: './visualization-page.component.html',
  styleUrls: ['./visualization-page.component.scss']
})

export class VisualizationPageComponent {
  @ViewChild(DagVisualisationComponent) graph: any;
  @ViewChild(FilterComponent) filterForm: any;
  @ViewChild(AppliedFiltersComponent) appliedFilters: any;


  public imageUrl_attention = "../../assets/images/attention.png";
  public imageUrl_help = "../../assets/images/help.png";
  public imageUrl_matrix = "../../assets/images/risk_factor_matrix.png";

  nodes: Node[] | undefined;
  filters: Filter | undefined;
  concernForest: ConcernForest = {roots: CONCERN_FOREST_EXAMPLE};
  concerns : Concerns | undefined;

  constructor(private nodesService: NodesService, private dialog: MatDialog,
              private modalService: ModalService, private filterService: FilterService) {
  }

  ngOnInit(): void {
    this.nodesService.getNodes().subscribe(nodes => {
      this.nodes = nodes;
    });
    this.filterService.getConcernData().subscribe(concerns => {
      this.concernForest = concerns;
    });
  }

  openDialog(nodeId: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { nodeId };
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60vw';
    dialogConfig.height = 'auto';
    dialogConfig.maxHeight = '90vh';
    dialogConfig.position = { top: '25vh', left: '20vw' };
    dialogConfig.panelClass = 'my-dialog';

    this.dialog.open(DetailsComponent, dialogConfig);
  }

  handleFilterSelected(selectedFilters: Filter) {
    this.graph.removeHighlight();
    this.filters = selectedFilters;
    this.filterService
      .filterNodes(JSON.parse(JSON.stringify(selectedFilters)))
      .subscribe((response: NodeRisks[]) => this.graph.highlightNodes(response));
  }

  handleClearFilters() {
      this.graph.removeHighlight();
      this.filters = undefined;
      this.appliedFilters.hideApplied();
      this.filterForm.resetCheckboxes();
  }

  onNodeClick(d: any) {
    this.openDialog(d);
  }

  openModal(id: string) {
    this.modalService.open(id)
  }

  handleEditFilters(id: string, selectedFilters: Filter | undefined) {
    this.modalService.open(id);
    this.filterForm.populateFilters(selectedFilters);
  }

  exportChart() {
    if (this.graph) {
      this.graph.downloadSvgAsPng();
    }
  }

  closeModal(id: string) {
    this.modalService.close(id)
  }

  noFiltersMsg = false;

  public showApplied() {
    if (this.filters) {
      const appliedFilters = document.getElementById("applied-filters");
      appliedFilters!.hidden = false;

      const showButton = document.getElementById("show-applied");
      showButton!.style.display = "none";
    } else {
      this.noFiltersMsg = true;
      setTimeout(() => {
        this.noFiltersMsg = false;
      }, 2000);
    }
  }
}

const CONCERN_FOREST_EXAMPLE = [
  {
    concern: "Concern1",
    id: "1",
    subconcerns: [
      {
        concern: "Concern1.1",
        id: "1.1",
        subconcerns: []
      },
      {
        concern: "Concern1.2",
        id: "1.2",
        subconcerns: [
          {
            concern: "Concern1.2.1",
            id: "1.2.1",
            subconcerns: []
          },
          {
            concern: "Concern1.2.2",
            id: "1.2.2",
            subconcerns: [
              {
                concern: "Concern1.2.2.1",
                id: "1.2.2.1",
                subconcerns: []
              },
              {
                concern: "Concern1.2.2.2",
                id: "1.2.2.2",
                subconcerns: []
              }
            ]
          }
        ]
      },
      {
        concern: "Concern1.3",
        id: "1.3",
        subconcerns: []
      }
    ]
  },
  {
    concern: "Concern2",
    id: "2",
    subconcerns: [
      {
        concern: "Concern2.1",
        id: "2.1",
        subconcerns: []
      },
      {
        concern: "Concern2.2",
        id: "2.2",
        subconcerns: []
      }]
  }
];
