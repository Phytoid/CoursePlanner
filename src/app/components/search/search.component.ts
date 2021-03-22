import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from  "@angular/router";
import { AuthService } from 'src/app/auth/auth.service';
import { FormControl } from '@angular/forms';
// import { StudentService} from '../../services/student.service';
import { Student } from '../../models/student';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  students: Student[];
  //////Students array to store students from database
  //students: Student[];

  //////Constructor to inport Student model from .modeels/student
  //constructor(private studentService: StudentService) { }

  constructor(public studentService: StudentService) { }
  ngOnInit(): void {
    this.studentService.getStudents().subscribe(s => {
      this.students = s;
    });
    /////////Code to possibly pull from database
    // this.studentService.getStudents().subscribe(students => {
    //   this.students = students;
    // })
  }
}
