import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Courses } from 'src/app/models/courses';
import { CourseService } from 'src/app/services/course.service';

@Component({
  selector: 'app-suggest-course-plan',
  templateUrl: './suggest-course-plan.component.html',
  styleUrls: ['./suggest-course-plan.component.css']
})
export class SuggestCoursePlanComponent implements OnInit {
  prefWeight: number = 0;
  courseAdd: string[] = ['add', "weight"];
  courseAvoid: string[] = ['avoid'];
  c: string[] = ["a","b","c","d","e","f","g","h","i","j","k","l"];
  @ViewChild(MatSort) sort: MatSort;
  courses: Courses[];
  coursesCopy: Courses[];
  constructor(public courseServices:CourseService) { 
  }
  coursesToAddList=[
    {
      "courseName": "CSE 101", "prefWeight": this.prefWeight
    }
  ]
  coursesToAvoidList=[
    {
      "courseName": "CSE 101"
    }
  ]
  ngOnInit(): void {
    // let arr = [];
    // this.courseServices.getCourses().subscribe(s => {
    //   s.forEach(element => {
    //       arr.push(element);
    //   });
    // });
    // this.courses = arr;
    // this.coursesCopy = arr;
  }
  ngAfterInit(): void{
    location.reload();
  }
  addItemPref(): void {
    this.prefWeight++;
    this.coursesToAddList = this.coursesToAddList.concat({courseName:"CSE 110", "prefWeight": this.prefWeight});
    console.log(this.coursesToAddList);
  }
  addItemAvoid(): void{
    this.coursesToAvoidList = this.coursesToAvoidList.concat();
    console.log(this.coursesToAvoidList);
  }
}
