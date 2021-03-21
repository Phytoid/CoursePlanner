import { Component, OnInit } from '@angular/core';
import { Router } from  "@angular/router";
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-enrollment-trends',
  templateUrl: './enrollment-trends.component.html',
  styleUrls: ['./enrollment-trends.component.css']
})
export class EnrollmentTrendsComponent implements OnInit {

  constructor(private authService: AuthService, public router: Router) {
    if (this.authService.isLoggedIn == false) {
      this.router.navigate(['login'])
    }
  }

  ngOnInit(): void {
  }

}
