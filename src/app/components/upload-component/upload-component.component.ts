import {Component, Input, ViewChild} from '@angular/core';
import {UploadService} from "../../services/upload.service";

@Component({
  selector: 'app-upload-component',
  templateUrl: './upload-component.component.html',
  styleUrls: ['./upload-component.component.scss']
})
export class UploadComponentComponent {

  constructor(private uploadService: UploadService) {
  }

  @Input() text: string = "Import Supply Chain"
  @ViewChild ('dialog') dialogModal: any | undefined;
  json: JSON | undefined

  fileChanged(e: any) {
    const file = e.target.files[0];
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
    this.uploadService.uploadFile(<JSON>this.json)
    // @ts-ignore
    this.dialogModal.nativeElement.close()
  }

}
