import { Injectable } from '@angular/core';
import {Node, NodeDetails} from '../model/node'
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class NodesService {

  private nodeUrl = 'http://localhost:4200/api/nodes';

  constructor(private httpClient: HttpClient) { }

  public getNodes(): Observable<Node[]> {
    const url = this.nodeUrl
    return this.httpClient.get<Node[]>(url)
  }

  public getDetails(node: string): Observable<NodeDetails> {
    return this.httpClient.get<NodeDetails>(`${this.nodeUrl}/${node}/details`)
  }
}
