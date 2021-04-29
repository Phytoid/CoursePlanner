import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { StudentService } from 'src/app/services/student.service';
import { AngularFirestore} from '@angular/fire/firestore';
import { AngularFireDatabase } from '@angular/fire/database';

import { Observable } from 'rxjs';
import { RouterModule, Routes } from '@angular/router';

import { Router } from '@angular/router';

import bcrypt from 'bcryptjs';

interface User {
  email:string;
  password:string;
}


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})



export class LoginComponent implements OnInit {
  
  //constructor() { }
  constructor(private authService: AuthService, private studentService: StudentService, private afs: AngularFirestore, private router: Router) {}

  ngOnInit(): void {

  }

  loginUser(event){
    let email = event.srcElement[0].value;
    let password = event.srcElement[1].value;
    if (email === 'ams@stonybrook.edu' || email === 'bmi@stonybrook.edu' || email === 'cse@stonybrook.edu' || email === 'ece@stonybrook.edu') {
      this.authService.login(email, password);
    } else {
      this.afs.collection("Students").get().toPromise().then((querySnapshot) => {
        querySnapshot.forEach((child) => {
          var data = child.data();
          let email2 = data['email']
          let hash = data['password']
          let first = data['first']
          let last = data['last']
          let sbuID = data['sbuID']
          let router = this.router
          if(email === email2) {
            bcrypt.compare(password, hash, function(err, res) {
              if (res === true) {
                localStorage.setItem('user', (first + " " + last));
                localStorage.setItem('email', email);
                localStorage.setItem('userType', 'Student');
                localStorage.setItem('sbuID', sbuID);
                router.navigate(['student']);
              } else {
                alert(err + " Invalid login information. Please check your e-mail and password and try again.");
                return;
              }
            });
          }
        });
      });
      
    }
  }

}
