import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  private httpHeaders: HttpHeaders =  new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor(private httpClient: HttpClient) { }

  private nodeUrl = 'http://localhost:4200/api/nodes';

public filterNodes(json: JSON):Observable<string[]> {
    const httpOptions:Object = { headers: this.httpHeaders, responseType: 'json'}
    return this.httpClient
      .post<string[]>(`${this.nodeUrl}/filtered`,json, httpOptions)
      .pipe(
        catchError(
          error => {
            this.log('Not Valid Filter')
            return throwError(error);
          }
        )
      )
  }

  private log(message: string) {
    console.log(message)
  }
}
