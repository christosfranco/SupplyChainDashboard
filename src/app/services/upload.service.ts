import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, of, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private httpHeaders: HttpHeaders =  new HttpHeaders({ 'Content-Type': 'application/json' });
  private url: string = "http://localhost:4200/api/upload"


  constructor(private httpClient: HttpClient) { }

  public uploadFile(json: JSON, endpoint: string): Observable<Object> {

    const httpOptions:Object = { headers: this.httpHeaders, responseType: 'text'}
    return this.httpClient
      .post(`${this.url}/${endpoint}`,json, httpOptions)
  }

}
