import { Component, OnInit } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';

import { Observable } from 'rxjs';

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
  constructor(private db: AngularFireDatabase) {}


  ngOnInit(): void {
    
    console.log("init login")
    
  }
    

    
  

  loginUser(event){
    console.log(event)
    let email = event.srcElement[0].value;
    let password = event.srcElement[1].value;
    this.db.database.ref().child("Persons").on('value', (shapshot) => {
      shapshot.forEach((child) => {
          var data = child.val();
          let email2 = data[Object.keys(data)[0]].email
          if(email == email2) {
            if(password == data[Object.keys(data)[0]].password) {
              console.log("Success!")
              return;
            }
          }

          
      })
    })
    console.log("Failed to login!")
    event.preventDefault()
  }

}
