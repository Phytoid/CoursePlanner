import { Component, OnInit } from '@angular/core';
import { Router } from  "@angular/router";
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {
  studentName: string;
  
  constructor(private authService: AuthService, public router: Router) {
  
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['login'])
    }
  }

  ngOnInit(): void {
  }

  logout() {
    this.authService.logout()
  }
}
