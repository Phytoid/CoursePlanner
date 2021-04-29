import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-course-plan',
  templateUrl: './view-course-plan.component.html',
  styleUrls: ['./view-course-plan.component.css']
})
export class ViewCoursePlanComponent implements OnInit {
  courseView: string[] = ['name', "sem", "grade"];
  coursePlan: [];
  constructor() { }

  ngOnInit(): void {
  }

}
