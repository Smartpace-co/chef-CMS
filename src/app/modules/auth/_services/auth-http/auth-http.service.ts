import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserModel } from '../../_models/user.model';
import { environment } from '../../../../../environments/environment';
import { AuthModel } from '../../_models/auth.model';

const API_USERS_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root',
})
export class AuthHTTPService {
  constructor(private http: HttpClient) { }

  // public methods
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${API_USERS_URL}/login`, { username:email, password : password });
  }

  // CREATE =>  POST: add a new user to the server
  createUser(user: UserModel): Observable<any> {
    return this.http.post(API_USERS_URL, user);
  }

  // Your server should check email => If email exists send link to the user and return true | If email doesn't exist return false
  forgotPassword(email: string): Observable<boolean> {
    return this.http.post<boolean>(`${API_USERS_URL}/forgotPassword/validateEmail`, {
      email,
    });
  }

 // Your server should check email => If email exists change password to the user and return true | If email doesn't exist return false
  resetPassword(params: any,token): Observable<boolean> {
    return this.http.put<boolean>(`${API_USERS_URL}/resetPassword`, params,{headers: {
      token: `${token}`}
    });
  }

  getUserByToken(token): Observable<UserModel> {
   
    return this.http.get<UserModel>(`${API_USERS_URL}/userByToken`);
  }
}
  