import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Courses } from './../../models/courses';
import { CourseService } from './../../services/course.service';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from  "@angular/router";
import { AuthService } from 'src/app/auth/auth.service';
import { CourseDialogComponent } from '../course-dialog/course-dialog.component';
import { NgxPaginationModule } from 'ngx-pagination'
export interface DialogData {
  course: string;
  name: string;
  description: string;
  credits: number;
  prereqs: string;
  semester: string;
}

@Component({
  selector: 'app-course-info',
  templateUrl: './course-info.component.html',
  styleUrls: ['./course-info.component.css']
})
export class CourseInfoComponent implements OnInit {
  courses: Courses[];
  coursesCopy: Courses[];
  c:String[];
  tempCopy:String[];
  totalRecords: Number;
  page: Number=1;
  constructor(private authService: AuthService, public router: Router, public courseService: CourseService, public dialog: MatDialog) {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['login'])
    }
  }

  ngOnInit(): void {
    var arr: any = []
    var a: any = [];
    this.courseService.getCourses().subscribe(s => {
      s.forEach(element => {
          arr.push(element);
      });
      this.totalRecords = arr.length;    
    });
    this.courses = arr;
    this.coursesCopy = arr;
    console.log(this.courses)
    // this.totalRecords = 12;
    // this.c = ["a","b","c","d","e","f","g","h","i","j","k","l"];
    // this.tempCopy = this.c;
    // this.c = arr
  }
  ngAfterInit(): void{
    location.reload();
  }

  openDialog(event:Courses): void {
    const dialogRef = this.dialog.open(CourseDialogComponent, {
      width: '50%',
      data: {name: event.courseName, course: event.course, description: event.description, credits: event.credits, prereqs: event.graduatePreq, semester:event.semester}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  applyFilter(substring: string) {
    if (substring !== "") {
      substring = substring.trim().toLowerCase();
      let temp: any = [];
      this.courses.forEach(element => {
        if(element.course.includes(substring) || element.description.includes(substring) || element.department.includes(substring)){
          temp.push(element);
        }
        // if(element.includes(substring)){
        //   temp.push(element);
        // }
      });
      this.courses=temp;
    }
    else{
      this.courses = this.coursesCopy;
    }
  }

}
