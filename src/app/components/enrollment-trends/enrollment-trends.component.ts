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
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['login'])
    }
  }

  ngOnInit(): void {
  }


  addCourse(event) {
    console.log("add course!\n");
    let department = ((<HTMLInputElement>document.getElementById("mat-input-0")).value);
    let course = ((<HTMLInputElement>document.getElementById("mat-input-1")).value);

    let semester_start = ((<HTMLInputElement>document.getElementById("mat-input-2")).value);
    let semester_end = ((<HTMLInputElement>document.getElementById("mat-input-3")).value);

    let year_start = ((<HTMLInputElement>document.getElementById("mat-input-4")).value);
    let year_end = ((<HTMLInputElement>document.getElementById("mat-input-5")).value);
  }

}
