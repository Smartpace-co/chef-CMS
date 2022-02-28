import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { UserModel } from '../../../_models/user.model';
import { AuthModel } from '../../../_models/auth.model';
import { UsersTable } from '../../../../../_fake/fake-db/users.table';
import { environment } from '../../../../../../environments/environment';

const API_USERS_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root',
})
export class AuthHTTPService {
  constructor(private http: HttpClient) { }

  // public methods
  login(email: string, password: string): Observable<any> {
    const notFoundError = new Error('Not Found');
    if (!email || !password) {
      return of(notFoundError);
    }

    return this.http.post(API_USERS_URL+'/login',{username:email,password:password}).pipe(
      map((result:any) => {
        if (!result) {
          return notFoundError;
        }

       /*  const user = result.find((u) => {
          return (
            u.email.toLowerCase() === email.toLowerCase() &&
            u.password === password
          );
        }); */

        let auth = new AuthModel();
        auth = result.data
      //  auth.refreshToken = user.refreshToken;
      //  auth.expiresIn = new Date(Date.now() + 100 * 24 * 60 * 60 * 1000);
        return auth;
      })
    );
  }

  createUser(user: UserModel): Observable<any> {
    user.roles = [2]; // Manager
    user.token = 'access-token-' + Math.random();
  //  user.refreshToken = 'access-token-' + Math.random();
  //  user.expiresIn = new Date(Date.now() + 100 * 24 * 60 * 60 * 1000);
    user.pic = './assets/media/users/default.jpg';

    return this.http.post<UserModel>(API_USERS_URL, user);
  }

  forgotPassword(email: string): Observable<boolean> {
    return this.http.post(API_USERS_URL+'/forgotPassword/validateEmail',{email:email}).pipe(
      map((result: any) => {
        let user;
        if(result.data){
           user= result.data;
        }
        return user !== undefined;

        /* const user = result.find(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        ); */
      })
    );
  }

  
  resetPassword(users: any): Observable<boolean> {
    console.log(users);
    return this.http.put(API_USERS_URL+'/resetPassword',{}).pipe(
      map((result: UserModel[]) => {
        const user = result.find(
          (u) => u.email.toLowerCase() === users.email.toLowerCase()
        );
        return user !== undefined;
      })
    );
  }

  getUserByToken(user): Observable<UserModel> {

    if (!user) {
      return of(undefined);
    }

    return of(user);
  }

  getAllUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(API_USERS_URL);
  }
}
