import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilesNamesService {
  public supplyChainFileName: string = '';
  public concernTreeFileName: string = '';

  constructor() { }
}
