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
  temp: Student[];
  //searchStudents: Student[] = [];
  //////Students array to store students from database
  //students: Student[];

  //////Constructor to inport Student model from .modeels/student
  //constructor(private studentService: StudentService) { }

  constructor(public studentService: StudentService) { }
  ngOnInit(): void {
    this.studentService.getStudents().subscribe(s => {
      this.students = s;
      this.temp = s;
    });
    /////////Code to possibly pull from database
    // this.studentService.getStudents().subscribe(students => {
    //   this.students = students;
    // })
  }

  onSubmit(f: NgForm){
    var searchStudents: Student[] = [];
    this.students = this.temp;
    //console.log(f.value);
    const str:String = f.value.name;

    this.students.forEach(element => {
      console.log(element);
      if(str.toLowerCase() == element.id.toLowerCase() || (str.toLowerCase() == element.first.toLowerCase() || str.toLowerCase() == element.last.toLowerCase() )){
        searchStudents.push(element);
      }
    });
    if(searchStudents.length > 0){
      this.students = searchStudents;
    }
    //this.students = this.searchStudents;
  }
}
