import { Injectable } from '@angular/core';
import { Node } from '../model/node'
import {Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class NodesService {

  private nodes2 = [
    {
      "id": "0",
      "product":"a",
      "parentIds": ["8"]
    },
    {
      "id": "1",
      "product":"a",
      "parentIds": []
    },
    {
      "id": "2",
      "product":"a",
      "parentIds": []
    },
    {
      "id": "3",
      "product":"a",
      "parentIds": ["11"]
    },
    {
      "id": "4",
      "product":"a",
      "parentIds": ["12"]
    },
    {
      "id": "5",
      "product":"a",
      "parentIds": ["18"]
    },
    {
      "id": "6",
      "product":"a",
      "parentIds": ["9", "15", "17"]
    },
    {
      "id": "7",
      "product":"a",
      "parentIds": ["3", "17", "20", "21"]
    },
    {
      "id": "8",
      "product":"a",
      "parentIds": []
    },
    {
      "id": "9",
      "product":"a",
      "parentIds": ["4"]
    },
    {
      "id": "10",
      "product":"a",
      "parentIds": ["16", "21"]
    },
    {
      "id": "11",
      "product":"a",
      "parentIds": ["2"]
    },
    {
      "id": "12",
      "product":"a",
      "parentIds": ["21"]
    },
    {
      "id": "13",
      "product":"a",
      "parentIds": ["4", "12"]
    },
    {
      "id": "14",
      "product":"a",
      "parentIds": ["1", "8"]
    },
    {
      "id": "15",
      "product":"a",
      "parentIds": []
    },
    {
      "id": "16",
      "product":"a",
      "parentIds": ["0"]
    },
    {
      "id": "17",
      "product":"a",
      "parentIds": ["19"]
    },
    {
      "id": "18",
      "product":"a",
      "parentIds": ["9"]
    },
    {
      "id": "19",
      "product":"a",
      "parentIds": []
    },
    {
      "id": "20",
      "product":"a",
      "parentIds": ["13"]
    },
    {
      "id": "21",
      "product":"a",
      "parentIds": []
    }
  ]

  private nodes:Node[] = [
    {
      "id": "0",
      "company": "Self",
      "product":"Hotel",
      "parentIds": []
    },
    {
      "id": "1",
      "company":"Self",
      "product":"Website",
      "parentIds": ["0"]
    }
    ,
    {
      "id": "2",
      "company":"Booking.com",
      "product":"Booking Site",
      "parentIds": ["0"]
    },
    {
      "id": "3",
      "company":"trivago.com",
      "product":"Booking Site",
      "parentIds": ["0"]
    },
    {
      "id": "4",
      "company":"Self",
      "product":"Server",
      "parentIds": ["1"]
    },
    {
      "id": "5",
      "company":"Windows Server",
      "product":"Firewall",
      "parentIds": ["4"]
    },
    {
      "id": "6",
      "company":"Guard",
      "product":"Physical Security",
      "parentIds": ["4"]
    },
    {
      "id": "7",
      "company":"XY",
      "product":"Work Scheduler",
      "parentIds": ["0"]
    },
    {
      "id": "8",
      "company":"Amazon",
      "product":"Cleaning Supply",
      "parentIds": ["0"]
    }
  ]

  private highlightedNodes:String[] = ["8", "1"]

  constructor() { }

  public getNodes(): Observable<Node[]> {
    return of<Node[]>(this.nodes)
  }

  public getHighlights(): Observable<String[]> {
    return of<String[]>(this.highlightedNodes)
  }

}
