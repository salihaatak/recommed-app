import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JavascriptChannelServiceService {

  constructor() { }

  public myFunction(message: string) {
    console.log(`Console'dan çağrıldı: ${message}`);
  }
}
