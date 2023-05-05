import { Component } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Component({
  selector: 'app-user',
  templateUrl: '../View/visualize_view.html',
  styleUrls: ['../View/style/import_view.scss', "../View/style/visualize_view.scss", "../View/style/modular.scss",
    "../View/style/nicepage.scss"],
})

export class SupplyChainVisualise {
  data: any;
  isLoading: boolean = false;
  constructor(private http: HttpClient) {}

  getNodeDetails(){
    this.isLoading = true;
    this.http.get('/api/request_data').subscribe(response => {
    this.data = response;
    this.isLoading = false;
    console.log(response);
  });
}

}
