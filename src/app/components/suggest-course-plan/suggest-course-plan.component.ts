import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Courses } from 'src/app/models/courses';
import { CourseService } from 'src/app/services/course.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { MatYearView } from '@angular/material/datepicker';

@Component({
  selector: 'app-suggest-course-plan',
  templateUrl: './suggest-course-plan.component.html',
  styleUrls: ['./suggest-course-plan.component.css']
})

export class SuggestCoursePlanComponent implements OnInit {
  limitCourses=[];
  prefWeight: number = 0;
  //maxCourses: number = 0;
  courseAdd: string[] = ['add', "weight"];
  courseAvoid: string[] = ['avoid'];
  timeStart=[]
  timeEnd=[]
  sem=[];
  year=[];
  // c: string[] = ["a","b","c","d","e","f","g","h","i","j","k","l"];
  @ViewChild(MatSort) sort: MatSort;
  courses: Courses[];
  coursesCopy: Courses[];
  sbuID: string;
  gradYear: string;
  gradSemester: string;

  constructor(public courseServices:CourseService, public afs: AngularFirestore, public router: Router) { 
  }
  coursesToAddList=[]
  coursesToAvoidList=[]
  ngOnInit(): void {
    let arr = [];
    this.courseServices.getCourses().subscribe(s => {
      s.forEach(element => {
          arr.push(element);
      });
    });
    this.courses = arr;
    this.coursesCopy = arr;
    this.router.routerState.root.queryParams.subscribe(params => {
      this.sbuID = params['sbuID'];
    });
    this.afs.collection('Students').doc(this.sbuID).valueChanges().subscribe(val => {
      
    });
  }
  ngAfterInit(): void{
    this.afs.collection('Students').doc(localStorage.getItem('sbuID')).valueChanges().subscribe(val => {
      console.log(val);
    });
    location.reload();
  }
  addItemPref(event): void {
    var course = event.value;
    this.prefWeight++;
    this.coursesToAddList = this.coursesToAddList.concat({courseName: course, "prefWeight": this.prefWeight});
    
  }
  addItemAvoid(event): void{
    var course = event.value;
    this.coursesToAvoidList = this.coursesToAvoidList.concat({courseName: course});
    console.log(this.coursesToAvoidList);
  }

  timeSlotStart(event): void{
    var timeslot = event.target.value;
    var arr=[];
    arr = arr.concat(timeslot);
    this.timeStart = arr;
    console.log(this.timeStart);
  }
  timeSlotEnd(event): void{
    var timeslot = event.target.value;
    var arr=[];
    arr = arr.concat(timeslot);
    this.timeEnd = arr;
    console.log(this.timeEnd);
  }
  coursesSemYear(event): void{
    //event.target.value
    var courses = event.target[0].value;
    var x = event.target[1].value;
    var y = event.target[2].value;
    this.limitCourses.push(courses);
    this.sem.push(x);
    this.year.push(y);
    //this.maxCourses = courses;
    console.log(this.courses);
    console.log(this.sem);
    console.log(this.year);
  }
  suggestCoursePlan(): void {
    //var required_courses = ;
    //var preferred_courses = ;
    //var avoid_courses = ;
    //var electives_list = ;
    //var semester_list = ;

  }

  suggestCoursePlanSmartMode(required_courses, preferred_courses, avoid_courses, electives_list, semester_list, day_start, day_end, max_n): void {
    var cp_list = [];
    var fail_counter = 0;

  }

  suggestCoursePlanDefaultMode(required_courses, preferred_courses, avoid_courses, electives_list, semester_list, day_start, day_end, max_n): void {
    var cp_list = [];
    var fail_counter = 0;
    required_courses = required_courses.sort((a, b) => parseInt(a.substr(a.length - 3)) - parseInt(b.substr(b.length - 3)));
    // TODO: MAKE SURE ALL COURSES WITH PREREQUISITES COME AFTER IT IN THE LIST
    if (avoid_courses.some(item => required_courses.includes(item))) {
      alert("A course required to graduate is in your list of courses to avoid. Please reconsider your parameters and try again.");
    }
    if (max_n.reduce(function(a, b){return a + b}, 0) > required_courses.length) {
      var sem_array = semester_list[semester_list.length - 1].split(" ")
      let sem = sem_array[0];
      let year = sem_array[1];
      if (sem.toLocaleLowerCase() === 'spring') {
        semester_list.push("Fall ".concat(year));
      } else {
        let yearInt = parseInt(year);
        semester_list.push("Spring ".concat((year + 1).toString()));
      }
    }
    // for (i = 0; i < semester_list.length; i++) {
      // TODO: SEE IF COURSE OFFERINGS ARE AVAILABLE FOR THAT SEMESTER
      // if course offerings available {
    
  }
}
