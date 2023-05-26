import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ConcernNode, Filter} from '../../model/filters';

@Component({
  selector: 'app-applied-filters',
  templateUrl: './applied-filters.component.html',
  styleUrls: ['./applied-filters.component.scss']
})
export class AppliedFiltersComponent {
  @Input() filters: Filter | undefined;
  @Output() clearFilters: EventEmitter<void> = new EventEmitter<void>();
  @Output() editFilters: EventEmitter<{ id: string; selectedFilters: Filter | undefined }> =
    new EventEmitter<{ id: string; selectedFilters: Filter | undefined }>();

  public imageUrl_edit = "../../assets/images/edit.png";
  public imageUrl_trash = "../../assets/images/trash.png";

  ngOnInit(): void {
    const appliedFilters = document.getElementById("applied-filters");
    appliedFilters!.hidden = true;
  }

  // @ts-ignore
  filterNamesSet : string[] = Array(new Set(this.filters?.conditions.map(filter => filter.conditionName) || []));

  handleClearFilters() {
    this.clearFilters.emit();
  }

  handleEditFilters(id: string, selectedFilters: Filter | undefined) {
    this.editFilters.emit({ id, selectedFilters });
  }

  getFilterDisplayName(conditionName: string): string {
    switch (conditionName) {
      case 'risk_level':
        return 'Risk Level';
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

  getMinValue(filter: any): any {
    const minFilter = this.filters?.conditions.find((f: any) => f.conditionName === filter.conditionName && f.operator === 'GT');
    return minFilter ? minFilter.value : 0;
  }

  getMaxValue(filter: any): any {
    const maxFilter = this.filters?.conditions.find((f: any) => f.conditionName === filter.conditionName && f.operator === 'LT');
    return maxFilter ? maxFilter.value : 0;
  }

  getFilterDisplay(filter: any) {
    if (filter.operator == "EQ") {
      return " is equal to "+ filter.value+".";
    }
    const ltValue = filter.value;
    const gtValue = this.filters!.conditions.find((f: any) => f.conditionName === filter.conditionName && f.operator === 'GT')!.value;
    return " is between "+gtValue+" and "+ltValue+".";
  }

  public hideApplied() {
    const appliedFilters = document.getElementById("applied-filters");
    appliedFilters!.hidden = true;

    const showButton = document.getElementById("show-applied");
    showButton!.style.display = "block";
  }


}
