import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParamsOptions} from "@angular/common/http";
import {catchError, Observable, of, tap, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private httpHeaders: HttpHeaders =  new HttpHeaders({ 'Content-Type': 'application/json' });
  private url: string = "/api/postSupplyChainData"

  constructor(private httpClient: HttpClient) { }

  public uploadFile(json: JSON) {

    const httpOptions:Object = { headers: this.httpHeaders, responseType: 'text'}
    this.httpClient
      .post(`${this.url}`,json, httpOptions)
      .pipe(
        catchError(
          error => {
            this.log('Not Valid Json')
            return throwError(error);
          }
        )
      )
      .subscribe(_ => console.log("Upload handling finished"));
  }

  public uploadSupplyChain(json: JSON) {
    this.log("Upload Supply Chain")
    this.uploadFile(json)
  }

  public uploadConcernTree(json: JSON) {
    this.log("Upload Concern Tree")
    this.uploadFile(json)
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(`${operation}: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {
    console.log(message)
  }

}
