import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';

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
  constructor(private authService: AuthService, private db: AngularFireDatabase, private router: Router) {}


  ngOnInit(): void {
    
    console.log("init login")
    this.db.database.ref().child("Persons").on('value', (shapshot) => {
      shapshot.forEach((child) => {
         
          console.log(child.val())
      })
    })
  }
    

    
  

  loginUser(event){
    console.log("Calling login!")
    let email = event.srcElement[0].value;
    let password = event.srcElement[1].value;
    this.authService.login(email, password);
  }

}
