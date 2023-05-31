import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  private httpHeaders: HttpHeaders =  new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor(private httpClient: HttpClient) { }

  public filterNodes(json: JSON) {
    const httpOptions:Object = { headers: this.httpHeaders, responseType: 'text'}
    return this.httpClient
      .post("api/nodes/filtered",json, httpOptions)
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
