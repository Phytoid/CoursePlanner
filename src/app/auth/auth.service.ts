import { StudentService } from './../services/student.service';
import { Student } from './../models/student';
import { Injectable } from '@angular/core';
import { Router } from  "@angular/router";
import { AngularFireAuth } from  "@angular/fire/auth";
import firebase from 'firebase/app';
import 'firebase/auth'
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: firebase.User;
  email: string;
  authState: any = null;

  constructor(public  afAuth:  AngularFireAuth, public router:  Router, public studentService: StudentService) {
    this.afAuth.authState.subscribe(user => {
      if (user){
        this.user = user;
        localStorage.setItem('user', JSON.stringify(this.user));
        localStorage.setItem('email', this.user.email);
      } else {
        localStorage.setItem('user', null);
      }
    })
  }
  
  async login(email: string, password: string) {
    var result = await firebase.auth().signInWithEmailAndPassword(email, password)
    localStorage.setItem('user', JSON.stringify(this.user));
    if (email.localeCompare("bmi@stonybrook.edu") == 0 || email.localeCompare("ams@stonybrook.edu") == 0 || email.localeCompare("cse@stonybrook.edu") == 0 || email.localeCompare("ece@stonybrook.edu") == 0) {
      localStorage.setItem('userType', 'GPD');
      this.router.navigate(['gpd']);
    } else {
      localStorage.setItem('userType', 'Student')
      this.router.navigate(['student']);
    }
  }

  async logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('email');
    await firebase.auth().signOut();
    this.router.navigate(['login']);
  }

  get isLoggedIn() {
    console.log("signing in");
    var loggedIn = true;
    if(localStorage.getItem('user') == "null" || localStorage.getItem('user') === null || !localStorage.getItem('user')){
      loggedIn = false
    }
    return loggedIn;
  }

  getisGPD(){
    if(localStorage.getItem('userType') == "GPD"){
      return true;
    }
    else{
      return false;
    }
  }

  ////////////////Used in student component to get student model
  // getStudent(): Student{
  //   var email = localStorage.getItem('email');
  //   console.log(email)
  //   this.studentService.getStudents().subscribe(s => {
  //     var students = s;
  //     for(var i = 0; i < students.length; i++){
  //       if(students[i].email == email){
  //         return students[i];
  //       }
  //     }
  //   });
  //   return null;
  // }

}

