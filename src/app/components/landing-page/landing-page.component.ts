import {Component, ViewChild} from '@angular/core';
import {ModalService} from "../../services/modal.service";
import {UploadComponentComponent} from "../upload-component/upload-component.component";
import {UploadService} from "../../services/upload.service";
import {FilesNamesService} from "../../services/files-names.service";
import {catchError, EMPTY} from "rxjs";

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent {
  @ViewChild(UploadComponentComponent) uploadComponent: any | undefined;
  public imageUrl_help = "assets/images/help.png";

  supplyChainFileName = "";
  concernTreeFileName = "";

  constructor(public modalService: ModalService,
              private uploadService: UploadService,
              public fileService: FilesNamesService
  ) {
  }

  setSupplyChainFileName(fileName: string) {
    this.fileService.supplyChainFileName = fileName
  }

  setConcernTreeFileName(fileName: string) {
    this.fileService.concernTreeFileName = fileName
  }

  openModal(id: string) {
    this.modalService.open(id)
  }

  closeModal(id: string) {
    this.modalService.close(id)
  }

}
