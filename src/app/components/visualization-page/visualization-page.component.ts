import { Component, ViewChild } from '@angular/core';
import { Node } from "../../model/node";
import { NodesService } from "../../services/nodes.service";
import { DagVisualisationComponent } from "../dag-visualisation/dag-visualisation.component";
import { DetailsComponent } from "../details/details.component";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import * as d3 from "d3";
import {ModalService} from "../modal/modal.service";

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

    this.selectedConcernNodes = null;
    this.concernForest = {roots: CONCERN_FOREST_EXAMPLE};

    this.filters = FILTERS_EXAMPLE;
  }

  ngOnInit(): void {
    this.nodesService.getNodes().subscribe(nodes => {
      this.nodes = nodes;
    });
    this.nodesService.getHighlights().subscribe(highlightedNodesIds => {
      this.highlightedNodesIds = highlightedNodesIds;
    });


    /* For the filtering modal window
    *  This section is used for creating dual sliders*/
    const ids = [["toSliderRisk", "fromSliderRisk", "fromInputRisk", "toInputRisk"],
      ["toSliderLikelihood", "fromSliderLikelihood", "fromInputLikelihood", "toInputLikelihood"],
      ["toSliderRiskFac", "fromSliderRiskFac", "fromInputRiskFac", "toInputRiskFac"]];
    ids.forEach((elementIds) => {
      const toSlider = document.getElementById(elementIds[0]);
      const fromSlider = document.getElementById(elementIds[1]);
      const fromInput = document.getElementById(elementIds[2]);
      const toInput = document.getElementById(elementIds[3]);

      console.log(toSlider);

      this.fillSlider(fromSlider, toSlider, toSlider);
      this.setToggleAccessible(toSlider);

      fromSlider!.oninput = () => this.controlFromSlider(fromSlider, toSlider, fromInput);
      toSlider!.oninput = () => this.controlToSlider(fromSlider, toSlider, toInput);
      fromInput!.oninput = () => this.controlFromInput(fromSlider, fromInput, toInput, toSlider);
      toInput!.oninput = () => this.controlToInput(toSlider, fromInput, toInput, toSlider);
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


  filterByRiskLevel = false;
  filterByLikelihood = false;
  filterByRiskFactor = false;
  filterByMitigation = false;

  noFiltersMsg = false;

  // Dual sliders
  private controlFromInput(fromSlider: any, fromInput: any, toInput: any, controlSlider: any) {
    const [from, to] = this.getParsed(fromInput, toInput);
    this.fillSlider(fromInput, toInput, controlSlider);
    if (from > to) {
      fromSlider.value = to;
      fromInput.value = to;
    } else {
      fromSlider.value = from;
    }
  }

  private controlToInput(toSlider: any, fromInput: any, toInput: any, controlSlider: any) {
    const [from, to] = this.getParsed(fromInput, toInput);
    this.fillSlider(fromInput, toInput, controlSlider);
    this.setToggleAccessible(toInput);
    if (from <= to) {
      toSlider.value = to;
      toInput.value = to;
    } else {
      toInput.value = from;
    }
  }

  private controlFromSlider(fromSlider: any, toSlider: any, fromInput: any) {
    const [from, to] = this.getParsed(fromSlider, toSlider);
    this.fillSlider(fromSlider, toSlider, toSlider);
    if (from > to) {
      fromSlider.value = to;
      fromInput.value = to;
    } else {
      fromInput.value = from;
    }
  }

  private controlToSlider(fromSlider: any, toSlider: any, toInput: any) {
    const [from, to] = this.getParsed(fromSlider, toSlider);
    this.setToggleAccessible(toSlider);
    this.fillSlider(fromSlider, toSlider, toSlider);
    if (from <= to) {
      toSlider.value = to;
      toInput.value = to;
    } else {
      toInput.value = from;
      toSlider.value = from;
    }
  }


  private getParsed(currentForm: any, currentTo: any) {
    const from = parseInt(currentForm.value, 10);
    const to = parseInt(currentTo.value, 10);
    return [from, to];
  }

  private fillSlider(from: any, to: any, control: any) {
    const rangeDistance = to.max - to.min;
    const fromPosition = from.value - to.min;
    const toPosition = to.value - to.min;
    control.style.background = `linear-gradient(
      to right,
      #C6C6C6 0%,
      #C6C6C6 ${(fromPosition) / (rangeDistance) * 100}%,
      blue ${((fromPosition) / (rangeDistance)) * 100}%,
      blue ${(toPosition) / (rangeDistance) * 100}%,
      #C6C6C6 ${(toPosition) / (rangeDistance) * 100}%,
      #C6C6C6 100%)`;
  }

  private setToggleAccessible(currTarget: any) {
    const toSlider = document.getElementById('toSlider');
    if (toSlider) {
      if (Number(currTarget.value) <= 0) {
        toSlider.style.zIndex = "2";
      } else {
        toSlider.style.zIndex = "1";
      }
    }
  }

  public concernForest: ConcernForest;
  public selectedConcernNodes: ConcernNode | null;
  filterNameField: string | undefined;

  public filters: Filter[] | undefined;

  public selectNode(node: ConcernNode, value: boolean): void {
    this.check(node, value);
  }

  check(node: any, value: boolean) {
    node.check = value;
    node.subconcerns.forEach((x: any) => {
      this.check(x, value);
    })
  };

  public resetCheckboxes() {
    const filterCheckboxes = document.querySelectorAll(".filter");

    // @ts-ignore
    filterCheckboxes.forEach((checkbox: HTMLInputElement) => {
      checkbox.checked = false;
    });

    this.filterByRiskLevel = false;
    this.filterByLikelihood = false;
    this.filterByRiskFactor = false;
    this.filterByMitigation = false;

    this.filterNameField = "";
  }

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

interface ConcernForest {
  roots: ConcernNode[];
}

interface ConcernNode {
  concern: string;
  check?: boolean;
  subconcerns: ConcernNode[];
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
