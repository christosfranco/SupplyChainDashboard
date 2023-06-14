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

  public uploadFile(json: JSON, endpoint: string): Observable<Object> {

    const httpOptions:Object = { headers: this.httpHeaders, responseType: 'text'}
    console.log(`${this.url}/${endpoint}`)
    return this.httpClient
      .post(`${this.url}/${endpoint}`,json, httpOptions)
  }

  public uploadSupplyChain(json: JSON): Observable<Object> {
    this.log("Upload Supply Chain")
    const endpoint = "supplychain"
    return this.uploadFile(json, endpoint)
  }

  public uploadConcernTree(json: JSON): Observable<Object> {
    this.log("Upload Concern Tree")
    const endpoint = "concerntree"
    return this.uploadFile(json, endpoint)
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
