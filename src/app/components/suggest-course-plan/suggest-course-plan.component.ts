import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-suggest-course-plan',
  templateUrl: './suggest-course-plan.component.html',
  styleUrls: ['./suggest-course-plan.component.css']
})
export class SuggestCoursePlanComponent implements OnInit {
  searchColumns: string[] = ['sbuID', 'lastName', 'firstName', 'dept', 
  'track', 'coursePlan', 'satisfied', 'pending', 'unsatisfied', 
  'validCoursePlan', 'gradSemester', 'gradYear', 'semesters', 'graduated']
  constructor() { }

  ngOnInit(): void {
  }

}
