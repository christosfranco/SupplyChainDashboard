import {Component, EventEmitter, Input, Output} from '@angular/core';
import {UploadService} from "../../services/upload.service";
import {ModalService} from "../modal/modal.service";

@Component({
  selector: 'app-upload-component',
  templateUrl: './upload-component.component.html',
  styleUrls: ['./upload-component.component.scss']
})
export class UploadComponentComponent {

  constructor(private uploadService: UploadService) {
  }
  @Input() text: string = "Import Supply Chain"
  @Input() modalService: ModalService | undefined;
  @Output() fileEvent = new EventEmitter<string>;
  json: JSON | undefined

  fileName=""

  fileChanged(e: any) {
    const file = e.target.files[0];
    this.fileName = file.name;
    const fileReader = new FileReader();
    fileReader.readAsText(file, "UTF-8");
    fileReader.onload = () => {
      // @ts-ignore
      this.json = JSON.parse(fileReader.result)
    }
    fileReader.onerror = (error) => {
      console.log(error);
    }
  }

  public uploadFile() {
    this.uploadService.uploadFile(<JSON>this.json);
    // @ts-ignore
    this.modalService?.close("import-sc");
    this.fileEvent.emit(this.fileName);
  }

}
