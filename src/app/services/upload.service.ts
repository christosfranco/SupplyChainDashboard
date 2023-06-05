import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, of, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private httpHeaders: HttpHeaders =  new HttpHeaders({ 'Content-Type': 'application/json' });
  private url: string = "/api/upload"


  constructor(private httpClient: HttpClient) { }

  public uploadFile(json: JSON, endpoint: string) {

    const httpOptions:Object = { headers: this.httpHeaders, responseType: 'text'}
    console.log(`${this.url}/${endpoint}`)
    this.httpClient
      .post(`${this.url}/${endpoint}`,json, httpOptions)
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
    const endpoint = "supplychain"
    this.uploadFile(json, endpoint)
  }

  public uploadConcernTree(json: JSON) {
    this.log("Upload Concern Tree")
    const endpoint = "upload/concerntree"
    this.uploadFile(json, endpoint)
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
