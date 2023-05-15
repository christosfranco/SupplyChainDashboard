import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-upload-component',
  templateUrl: './upload-component.component.html',
  styleUrls: ['./upload-component.component.scss']
})
export class UploadComponentComponent {

  @Input() text: string = "Import Supply Chain"
  fileChosen: boolean = false

  file:any;

  fileChanged(e: any) {
    this.fileChosen = true
    this.file = e.target.files[0];
    console.log(this.file)
    const fileReader = new FileReader();
    fileReader.readAsText(this.file, "UTF-8");
    fileReader.onload = () => {
      // @ts-ignore
      console.log(JSON.parse(fileReader.result));
    }
    fileReader.onerror = (error) => {
      console.log(error);
    }
  }

}
