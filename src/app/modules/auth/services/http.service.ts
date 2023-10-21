import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserModel } from '../models/user.model';
import { AuthModel } from '../models/auth.model';
import { UsersTable } from '../../../_fake/users.table';
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
      headers = headers.set("Authorization", "Bearer " + localStorage.getItem("token"));
    }
    return this.http.post(
      "https://alb-recommed-1454511849.eu-west-1.elb.amazonaws.com/api/" + url,
      payload,
      {
        headers: headers
      }
    )
  }

  createUser(user: UserModel): Observable<any> {
    user.roles = [2]; // Manager
    user.authToken = 'auth-token-' + Math.random();
    user.refreshToken = 'auth-token-' + Math.random();
    user.expiresIn = new Date(Date.now() + 100 * 24 * 60 * 60 * 1000);
    user.pic = './assets/media/avatars/300-1.jpg';

    return this.http.post<UserModel>(API_USERS_URL, user);
  }

  forgotPassword(email: string): Observable<boolean> {
    return this.getAllUsers().pipe(
      map((result: UserModel[]) => {
        const user = result.find(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        );
        return user !== undefined;
      })
    );
  }

  getUserByToken(token: string): Observable<UserModel | undefined> {
    const user = UsersTable.users.find((u: UserModel) => {
      return u.authToken === token;
    });

    if (!user) {
      return of(undefined);
    }

    return of(user);
  }

  getAllUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(API_USERS_URL);
  }
}
