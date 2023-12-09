import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

const API_USERS_URL = `${environment.apiUrl}/users`;

@Injectable({
  providedIn: 'root',
})
export class HTTPService {
  constructor(private http: HttpClient) {}

  post(url: string, payload: any, addAuth: boolean = true): Observable<any> {
    let headers: HttpHeaders = new HttpHeaders();
    if (addAuth){
      headers = headers.set("Authorization", "Bearer " + localStorage.getItem('token'));
    }
    return this.http.post(
      environment.apiUrl + url,
      payload,
      {
        headers: headers
      }
    )
  }

}
