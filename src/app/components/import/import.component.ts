import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent {
  @Input() text: string = "Import Supply Chain"

  constructor() {
  }

}
