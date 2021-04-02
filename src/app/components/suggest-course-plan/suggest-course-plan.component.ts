import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-suggest-course-plan',
  templateUrl: './suggest-course-plan.component.html',
  styleUrls: ['./suggest-course-plan.component.css']
})
export class SuggestCoursePlanComponent implements OnInit {
  prefWeight: number = 0;
  courseAdd: string[] = ['add', "weight"];
  courseAvoid: string[] = ['avoid'];
  //dataSource = this.courseAdd;
  @ViewChild(MatSort) sort: MatSort;
  constructor() { }
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

  }
  addItemPref(): void {
    this.prefWeight++;
    this.coursesToAddList.push();
  }
  addItemAvoid(): void{
    this.coursesToAvoidList.push();
  }
}
