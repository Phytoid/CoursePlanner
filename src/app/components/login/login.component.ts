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
  
  constructor() { }
  //constructor(private db: AngularFireDatabase) {}


  ngOnInit(): void {
    
    // console.log("init login")
    // this.db.database.ref().child("Persons").on('value', (shapshot) => {
    //   shapshot.forEach((child) => {
         
    //       console.log(child.val())
    //   })
    // })
  }
    

    
  

  loginUser(event){
    console.log(event)
    console.log(event.srcElement[0].value)
    console.log(event.srcElement[1].value)
    event.preventDefault()
  }

}
