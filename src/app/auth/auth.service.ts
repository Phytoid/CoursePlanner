import { Injectable } from '@angular/core';
import { Router } from  "@angular/router";
import { AngularFireAuth } from  "@angular/fire/auth";
import firebase from 'firebase/app';
import 'firebase/auth'


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: firebase.User;
  constructor(public  afAuth:  AngularFireAuth, public  router:  Router) {
    this.afAuth.authState.subscribe(user => {
      if (user){
        this.user = user;
        localStorage.setItem('user', JSON.stringify(this.user));
      } else {
        localStorage.setItem('user', null);
      }
    })
  }

  async login(email: string, password: string) {
    var result = await firebase.auth().signInWithEmailAndPassword(email, password)
    localStorage.setItem('user', JSON.stringify(this.user));
    if (email.localeCompare("bmi@stonybrook.edu") == 0 || email.localeCompare("ams@stonybrook.edu") == 0 || email.localeCompare("cse@stonybrook.edu") == 0 || email.localeCompare("ece@stonybrook.edu") == 0) {
      this.router.navigate(['gpd']);
    } else {
      this.router.navigate(['student']);
    }
  }

  async logout() {
    await firebase.auth().signOut();
    localStorage.removeItem('user');
    this.router.navigate(['login']);
  }

  get isLoggedIn() {
    return localStorage.getItem('user') !== null;
  }
}

