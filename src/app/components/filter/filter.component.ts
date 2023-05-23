import {Component, EventEmitter, Output} from '@angular/core';
import {ModalService} from "../modal/modal.service";
import {ConcernForest, ConcernNode, Condition, Filter} from '../../model/filters';

@Component({
  selector: 'filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})

export class FilterComponent {
  @Output() filterSelected = new EventEmitter<Filter>();

  public show_attention = false;
  public imageUrl_attention = "../../assets/images/attention.png";
  public attention_msg = "";

  public concernForest: ConcernForest;

  selectedConcernNodes: string[];
  selectedRisks: string[];

  selectedColor: string;
  filterNameField: string | undefined;

  constructor(private modalService: ModalService) {

    this.concernForest = {roots: CONCERN_FOREST_EXAMPLE};

    this.selectedConcernNodes = [];
    this.selectedRisks = [];

    this.selectedColor = "#e3c75e";
  }

  ngOnInit(): void {
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

      this.fillSlider(fromSlider, toSlider, toSlider);
      this.setToggleAccessible(toSlider);

      fromSlider!.oninput = () => this.controlFromSlider(fromSlider, toSlider, fromInput);
      toSlider!.oninput = () => this.controlToSlider(fromSlider, toSlider, toInput);
      fromInput!.oninput = () => this.controlFromInput(fromSlider, fromInput, toInput, toSlider);
      toInput!.oninput = () => this.controlToInput(toSlider, fromInput, toInput, toSlider);
    });
  }

  filterByRiskLevel = false;
  filterByLikelihood = false;
  filterByRiskFactor = false;
  filterByMitigation = false;


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


  public selectNode(node: ConcernNode, value: boolean): void {
    this.check(node, value);
  }

  check(node: any, value: boolean) {
    node.check = value;
    node.subconcerns.forEach((x: any) => {
      this.check(x, value);
    })
    if (value) {
      this.selectedConcernNodes.push(node.id);
    } else {
      const index = this.selectedConcernNodes.indexOf(node.id, 0);
      if (index > -1) {
        this.selectedConcernNodes.splice(index, 1);
      }
    }
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

    // this.clearFilters.emit();
  }

  public applyFilter() {

    if (this.filterNameField?.length) {

      var conditionList: Condition[] = [];

      // CONCERNS
      if (this.selectedConcernNodes.length) {
        conditionList.push({
          conditionName: "concerns",
          operator: "IN",
          value: this.selectedConcernNodes
        });
      }

      // RISKS
      // TODO


      // RISK LEVEL
      if (this.filterByRiskLevel) {
        const fromRiskLevel = (<HTMLInputElement>document.getElementById("fromSliderRisk")!).value;
        const toRiskLevel = (<HTMLInputElement>document.getElementById("toSliderRisk")!).value;
        if (fromRiskLevel == toRiskLevel) {
          conditionList.push({
            conditionName: "risk_level",
            operator: "EQ",
            value: fromRiskLevel
          });
        }
        else {
          conditionList.push({
            conditionName: "risk_level",
            operator: "GT",
            value: fromRiskLevel
          });
          conditionList.push({
            conditionName: "risk_level",
            operator: "LT",
            value: toRiskLevel
          })
        }
      }

      // LIKELIHOOD
      if (this.filterByLikelihood) {
        const fromLikelihood = (<HTMLInputElement>document.getElementById("fromSliderLikelihood")!).value;
        const toLikelihood = (<HTMLInputElement>document.getElementById("toSliderLikelihood")!).value;
        if (fromLikelihood == toLikelihood) {
          conditionList.push({
            conditionName: "likelihood",
            operator: "EQ",
            value: fromLikelihood
          });
        }
        else {
          conditionList.push({
            conditionName: "likelihood",
            operator: "GT",
            value: fromLikelihood
          });
          conditionList.push({
            conditionName: "likelihood",
            operator: "LT",
            value: toLikelihood
          })
        }
      }

      // RISK FACTOR
      if (this.filterByRiskFactor) {
        const fromRiskFactor = (<HTMLInputElement>document.getElementById("fromSliderRiskFac")!).value;
        const toRiskFactor = (<HTMLInputElement>document.getElementById("toSliderRiskFac")!).value;
        if (fromRiskFactor == toRiskFactor) {
          conditionList.push({
            conditionName: "risk_factor",
            operator: "EQ",
            value: fromRiskFactor
          });
        }
        else {
          conditionList.push({
            conditionName: "risk_factor",
            operator: "GT",
            value: fromRiskFactor
          });
          conditionList.push({
            conditionName: "risk_factor",
            operator: "LT",
            value: toRiskFactor
          })
        }
      }

      // MITIGATION STRATEGY
      if (this.filterByMitigation) {
        const hasMitigation = (<HTMLInputElement>document.getElementById("has-mitigation")!).checked;
        const noMitigation = (<HTMLInputElement>document.getElementById("no-mitigation")!).checked;
        if (hasMitigation) {
          conditionList.push({
            conditionName: "mitigation",
            operator: "EQ",
            value: "yes"
          });
        }
        else if (noMitigation) {
          conditionList.push({
            conditionName: "mitigation",
            operator: "EQ",
            value: "no"
          });
        }
      }

      if (conditionList.length) {
        const newFilter: Filter = {
          name: this.filterNameField,
          color: (<HTMLInputElement>document.querySelector("#filter-color")!).value,
          conditions: conditionList
        }

        this.resetCheckboxes();
        this.modalService.close("filter-modal");
        console.log(newFilter);

        this.filterSelected.emit(JSON.parse(JSON.stringify(newFilter)));
      } else {
        this.attention_msg = "Please select at least one condition."

        this.show_attention = true;
        setTimeout(() => {
          this.show_attention = false;
        }, 2000);
      }

    } else {
      this.attention_msg = "Please select a name for the filter."

      this.show_attention = true;
      setTimeout(() => {
        this.show_attention = false;
      }, 2000);
    }
  }

  populateFilters(filter: Filter) {
    this.resetCheckboxes();

    if (filter.conditions.find(condition => condition.conditionName === 'concerns')) {
      // @ts-ignore
      this.selectedConcernNodes = filter.conditions.find(condition => condition.conditionName === 'concerns')!.value;
      for(const concernId of this.selectedConcernNodes){
        const checkbox = document.getElementById(concernId) as HTMLInputElement;
        checkbox.checked = true;
      }
    }

    if (filter.conditions.find(condition => condition.conditionName === 'risks')) {
      const riskCondition = filter.conditions.find(condition => condition.conditionName === 'risks')!;
      // TODO
    }

    if (filter.conditions.find(condition => condition.conditionName === 'risk_level')) {
      this.filterByRiskLevel = true;
      const riskLevelCondition = filter.conditions.find(condition => condition.conditionName === 'risk_level')!;
      riskLevelCondition.value;
    }

    if (filter.conditions.find(condition => condition.conditionName === 'likelihood')) {
      this.filterByLikelihood = true;
      const likelihoodCondition = filter.conditions.find(condition => condition.conditionName === 'likelihood')!;
      likelihoodCondition.value;
    }

    if (filter.conditions.find(condition => condition.conditionName === 'risk_factor')) {
      this.filterByRiskFactor = true;
      const riskFactorCondition = filter.conditions.find(condition => condition.conditionName === 'risk_factor')!;
      riskFactorCondition.value;
    }

    if (filter.conditions.find(condition => condition.conditionName === 'mitigation')) {
      this.filterByMitigation = true;
      const mitigationCondition = filter.conditions.find(condition => condition.conditionName === 'mitigation')!;
      const mitigationValue = mitigationCondition.value;
      if (mitigationValue === "yes") {
        const hasMitigationRadioButton = document.getElementById('has-mitigation') as HTMLInputElement;
        hasMitigationRadioButton.checked = true;
      } else if (mitigationValue === "no") {
        const noMitigationRadioButton = document.getElementById('no-mitigation') as HTMLInputElement;
        noMitigationRadioButton.checked = true;
      }
    }
    this.filterNameField = filter.name;
    this.selectedColor = filter.color;
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


