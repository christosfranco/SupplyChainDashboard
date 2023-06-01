import {Component, ViewChild} from '@angular/core';
import {ModalService} from "../../services/modal.service";
import {UploadComponentComponent} from "../upload-component/upload-component.component";

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent {
  @ViewChild(UploadComponentComponent) uploadComponent: any | undefined;
  public imageUrl_help = "../../assets/images/help.png";
  fileName = "";

  constructor(public modalService: ModalService) {
  }

  setFileName(fileName: string) {
    this.fileName = fileName
  }

  openModal(id: string) {
    this.modalService.open(id)
  }

  closeModal(id: string) {
    this.modalService.close(id)
  }

}
