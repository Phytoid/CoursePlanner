import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { AngularFirestore} from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { RouterModule, Routes } from '@angular/router';

import { Router } from '@angular/router';

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
  constructor(private authService: AuthService, private db: AngularFirestore, private router: Router) {}

  ngOnInit(): void {

  }

  loginUser(event){
    console.log("Calling login!")
    let email = event.srcElement[0].value;
    let password = event.srcElement[1].value;
    this.authService.login(email, password);
  }

}
