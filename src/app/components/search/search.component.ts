import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from  "@angular/router";
import { AuthService } from 'src/app/auth/auth.service';
import { FormControl, NgForm } from '@angular/forms';
import { MatInputModule  } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Student } from '../../models/student';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  students: Student[];
  searchStudents: Student[] = [];
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

  onSubmit(f: NgForm){
    //console.log(f.value);
    const str:String = f.value.name;
    console.log(str);
    this.students.forEach(element => {
      if(str == element.id || (str.indexOf(element.first) >= 0 && str.indexOf(element.last) >= 0)){
        this.searchStudents.push(element);
      }
    });
    if(this.searchStudents.length > 0){
      this.students = this.searchStudents;
    }
    //this.students = this.searchStudents;
  }
}
