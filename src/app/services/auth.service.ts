import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { login } from '../operations/mutation';
import { Apollo } from 'apollo-angular';
import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  constructor(
    private router: Router,
    private apollo:Apollo
  ) {}

  private loggedIn = new BehaviorSubject<boolean>(false);

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  loginMutation(user:string, password:string) {
    return this.apollo.mutate({
      mutation: login,
      variables: {
        user,
        password
      }
    });
  }

  login() {
    this.loggedIn.next(true);
    this.router.navigate(['/dashboard']);
  }

  changeState(state:boolean) {
    this.loggedIn.next(state);
  }

  logout() {
    this.loggedIn.next(false)
    localStorage.removeItem("token");
    this.router.navigate(["login"])
  }

  saveToken(token:string) {
    localStorage.setItem("token", token);
  }

  verifyToken() {
    let token = localStorage.getItem("token");
    console.log(token)
    if (token === null || token === "") {
      return false;
    }else {
      try {
        const { exp } = jwt_decode(token);
        if (Date.now() >= exp * 1000) {
          console.log("exp")
          return false;
        }
      } catch (err) {
        console.log("err")
        return false;
      }
    }
    return true;
  }

  
}
