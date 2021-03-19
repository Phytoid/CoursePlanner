import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    console.log("init login")
  }

  loginUser(event){
    console.log(event)
    console.log(event.srcElement[0].value)
    console.log(event.srcElement[1].value)
    event.preventDefault()
  }

}
