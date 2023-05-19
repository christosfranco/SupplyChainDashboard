import { Injectable } from '@angular/core';
import {Node, NodeDetails} from '../model/node'
import {Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class NodesService {

  private nodes:Node[] = [
    {
      "id": "0",
      "name":"Hotel",
      "parentIds": []
    },
    {
      "id": "1",
      "name":"Website",
      "parentIds": ["0"]
    }
    ,
    {
      "id": "2",
      "name":"Booking Site",
      "parentIds": ["0"]
    },
    {
      "id": "3",
      "name":"Booking Site",
      "parentIds": ["0"]
    },
    {
      "id": "4",
      "name":"Server",
      "parentIds": ["1"]
    },
    {
      "id": "5",
      "name":"Firewall",
      "parentIds": ["4"]
    },
    {
      "id": "6",
      "name":"Physical Security",
      "parentIds": ["4"]
    },
    {
      "id": "7",
      "name":"Work Scheduler",
      "parentIds": ["0"]
    },
    {
      "id": "8",
      "name":"Cleaning Supply",
      "parentIds": ["0"]
    }
  ]

  private highlightedNodes:String[] = ["8", "1"]
  private nodeUrl = 'api/nodes';

  constructor(private httpClient: HttpClient) { }

  public getNodes(): Observable<Node[]> {
    const url = this.nodeUrl
    return this.httpClient.get<Node[]>(url)
  }

  public getHighlights(): Observable<String[]> {
    const body = { message: '' }
    return this.httpClient.post<String[]>(`${this.nodeUrl}/filtered`, body)
  }

  public getDetails(node: string): Observable<NodeDetails> {
    return this.httpClient.get<NodeDetails>(`${this.nodeUrl}/${node}/details`)
  }
}
