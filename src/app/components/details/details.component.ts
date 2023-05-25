import { Component, Inject, OnInit } from '@angular/core';
import { NodeDetails } from "../../model/node";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import { NodesService } from "../../services/nodes.service";

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  public details: NodeDetails | undefined;
  public nodeId: string | undefined;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private nodesService: NodesService,
    private dialogRef: MatDialogRef<DetailsComponent>
  ) { this.nodeId = data.nodeId;}

  ngOnInit(): void {
    if (this.nodeId) {
      this.nodesService.getDetails(this.nodeId).subscribe(nodeDetails => {
        if (Array.isArray(nodeDetails) && nodeDetails.length > 0) {
          this.details = nodeDetails[0];
        }
      });
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
