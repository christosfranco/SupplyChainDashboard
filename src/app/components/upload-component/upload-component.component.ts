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

  public show_attention = false;
  public imageUrl_attention = "../../assets/images/attention.png";
  public attention_msg = "";

  fileName=""

  fileChanged(e: any) {
    const file = e.target.files[0];
    this.fileName = file.name;
    const fileReader = new FileReader();
    fileReader.readAsText(file, "UTF-8");
    fileReader.onload = () => {

      try {
        // @ts-ignore
        this.json = JSON.parse(fileReader.result)
      } catch (e) {
        console.error(e);
        this.attention_msg = "Please select a valid json file."

        this.show_attention = true;
        setTimeout(() => {
          this.show_attention = false;
        }, 2000);
      }

    }
    fileReader.onerror = (error) => {
      console.error(error);
      this.attention_msg = "Please select a valid json file."

      this.show_attention = true;
      setTimeout(() => {
        this.show_attention = false;
      }, 2000);
    }
  }

  public uploadFile() {
    this.uploadService.uploadFile(<JSON>this.json);
    // @ts-ignore
    this.modalService?.close("import-sc");
    this.fileEvent.emit(this.fileName);
  }

}
