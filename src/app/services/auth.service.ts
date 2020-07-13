import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  tokenTimer: any;
  private token: string;
  private isAuthenticated: boolean = false;
  private userId: string;
  private authListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) { }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getAuthListener() {
    return this.authListener.asObservable();
  }

  storeCredentials(email: string, password: string) {
    const user: User = { email: email, password: password }
    this.http.post<{ message: string, user: User }>('http://localhost:3000/api/user/signup', user)
      .subscribe(data => {
        console.log(data.message);
        console.log(data.user);
      });

  }

  loginUser(email: string, password: string) {
    const user: User = { email: email, password: password };
    console.log('User data', user);
    this.http.post<{ message: string, token: string, userId: string, expiresIn: number }>('http://localhost:3000/api/user/login', user)
      .subscribe(data => {
        this.token = data.token;
        if (this.token) {
          this.isAuthenticated = true;
          this.userId = data.userId;
          this.authListener.next(true);
          const expiresInDuration = data.expiresIn;
          this.setAuthTimer(expiresInDuration);
          const nowDate = new Date();
          const expirationDate = new Date(nowDate.getTime() + expiresInDuration * 1000);
          this.saveAuthData(this.token, expirationDate, this.userId);
          this.router.navigate(['/']);
        }
      });
  }

  logoutUser() {
    this.token = null;
    this.userId = null;
    this.isAuthenticated = false;
    this.authListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);

  }

  autoLoginUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime(); //true or false
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.userId = authInformation.userId;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authListener.next(true);
    }
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logoutUser();

    }, duration * 1000);
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    };
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }
}
