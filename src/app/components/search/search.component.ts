import { Component, OnInit } from '@angular/core';
import { Router } from  "@angular/router";
import { AuthService } from 'src/app/auth/auth.service';
import { FormControl } from '@angular/forms';
// import { StudentService} from '../../services/student.service';
import { Student } from '../../models/student';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  // filters = new FormControl();
  // filtersList: string[] = ["Course Plan Validity", "Course Plan Completeness", "Graduation Semester", "Graduation Year"];
  //students: Student[];

  //constructor(private studentService: StudentService) { }
  constructor(private authService: AuthService, public router: Router) {
    if (this.authService.isLoggedIn == false) {
      this.router.navigate(['login'])
    }
  }
  ngOnInit(): void {
    // this.studentService.getStudents().subscribe(students => {
    //   this.students = students;
    // })
  }


}
