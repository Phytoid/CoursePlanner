import { Component, OnInit } from '@angular/core';
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
  constructor(private db: AngularFireDatabase, private router: Router) {}


  ngOnInit(): void {
    
    console.log("init login")
    
  }
    

    
  

  loginUser(event){
    console.log("Calling login!")
    let email = event.srcElement[0].value;
    let password = event.srcElement[1].value;
    this.db.database.ref().child("Persons").on('value', (snapshot) => { // TODO: cant exit for each loop in angular : https://github.com/angular/angular.js/issues/263
      snapshot.forEach((child) => {
          var data = child.val();
          let email2 = data[Object.keys(data)[0]].email
          if(email == email2) {
            if(password == data[Object.keys(data)[0]].password) {
              console.log("Success!")
              this.router.navigateByUrl("/student");
              return
            }
          }

          
      })
    })
    console.log("Failed to login!") // This will run even if log in succesful
    event.preventDefault()
  }

}
