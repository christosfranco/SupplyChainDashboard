import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {NodeDetails, NodeRisks} from "../model/node";
import {Concern, Concerns, ConcernsDataResponse, ConcernResponse} from "../model/concerns";
import {ConcernForest} from "../model/filters";
import { map } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class FilterService {

  private httpHeaders: HttpHeaders =  new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor(private httpClient: HttpClient) { }

  private url = 'http://localhost:4200/api';

  public filterNodes(json: JSON):Observable<NodeRisks[]> {
    const httpOptions:Object = { headers: this.httpHeaders, responseType: 'json'}
    return this.httpClient
      .post<NodeRisks[]>(`${this.url}/nodes/filtered`,json, httpOptions)
      .pipe(
        catchError(
          error => {
            this.log('Not Valid Filter')
            return throwError(error);
          }
        )
      )
  }

  public getConcernData(): Observable<Concerns> {
    return this.httpClient.get<ConcernsDataResponse>(`${this.url}/concerntree`).pipe(
      map((json:ConcernsDataResponse) => {
        return { roots : this.mapConcerns(json['Concern_Trees'])}
      })
    );
  }

  private mapConcerns(concerns: ConcernResponse[]): Concern[] {
      return concerns.map((concern: ConcernResponse) => {
        return {
          concern : concern.Concern_name,
          id : concern.Concern_ID,
          subconcerns : this.mapConcerns(concern.Children)
        }
      })
  }

  private log(message: string) {
    console.log(message)
  }
}
