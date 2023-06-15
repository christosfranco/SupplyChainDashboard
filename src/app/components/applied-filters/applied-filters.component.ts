import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ConcernForest, ConcernNode, Filter} from '../../model/filters';

@Component({
  selector: 'app-applied-filters',
  templateUrl: './applied-filters.component.html',
  styleUrls: ['./applied-filters.component.scss']
})
export class AppliedFiltersComponent {
  @Input() filters: Filter | undefined;
  @Input() concernForest: ConcernForest | undefined;
  @Output() clearFilters: EventEmitter<void> = new EventEmitter<void>();
  @Output() editFilters: EventEmitter<{ id: string; selectedFilters: Filter | undefined }> =
    new EventEmitter<{ id: string; selectedFilters: Filter | undefined }>();

  public imageUrl_edit = "assets/images/edit.png";
  public imageUrl_trash = "assets/images/trash.png";

  ngOnInit(): void {
    const appliedFilters = document.getElementById("applied-filters");
    appliedFilters!.hidden = true;
  }

  handleClearFilters() {
    this.clearFilters.emit();
  }

  handleEditFilters(id: string, selectedFilters: Filter | undefined) {
    this.editFilters.emit({ id, selectedFilters });
  }

  getFilterDisplayName(conditionName: string): string {
    switch (conditionName) {
      case 'risk_level':
        return 'Consequence';
      case 'likelihood':
        return 'Likelihood';
      case 'risk_factor':
        return 'Risk Factor';
      case 'mitigation':
        return 'Mitigation';
      case 'concerns':
        return 'Concerns';
      default:
        return conditionName;
    }
  }

  getFilterDisplay(filter: any) {
    if (filter.operator == "EQ") {
      return " is equal to "+ filter.value+".";
    }
    const ltValue = filter.value;
    const gtValue = this.filters!.conditions.find((f: any) => f.conditionName === filter.conditionName && f.operator === 'GT')!.value;
    return " is between "+gtValue+" and "+ltValue+".";
  }

  getConcernNames(concernIds: string[]|string): string {
    var appliedConcerns = "";
    for (const concernId of concernIds) {
      const concern = this.getConcernById(concernId, this.concernForest!.roots);
      if (concern) {
        if (appliedConcerns) {
          appliedConcerns += ", "
        }
        appliedConcerns += concern
      }
    }
    return appliedConcerns;
  }

  getConcernById(concernId:string, concerns: ConcernNode[]): string | undefined {
    for (const concern of concerns) {
      if (concern.id == concernId) {
        return concern.concern
      }
      if (concern.subconcerns.length) {
        const foundConcern = this.getConcernById(concernId, concern.subconcerns)
        if (foundConcern) {
          return foundConcern;
        }
      }
    }
    return undefined;
  }

  public hideApplied() {
    const appliedFilters = document.getElementById("applied-filters");
    appliedFilters!.hidden = true;

    const showButton = document.getElementById("show-applied");
    showButton!.style.display = "block";
  }


}
