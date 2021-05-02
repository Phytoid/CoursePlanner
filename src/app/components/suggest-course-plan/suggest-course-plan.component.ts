import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { Courses } from 'src/app/models/courses';
import { CourseService } from 'src/app/services/course.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { MatYearView } from '@angular/material/datepicker';
import { Student } from 'src/app/models/student';

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
  @ViewChild(MatTable) table: MatTable<any>;
  courses: Courses[];
  courseNames: string[];
  coursesCopy: Courses[];
  sbuID: string;
  gradYear: string;
  gradSemester: string;
  semesterList: string[];
  s: Student;
  prefDataSource: any;

  constructor(public courseServices:CourseService, public afs: AngularFirestore, public router: Router) { 
  }
  coursesToAddList=[]
  coursesToAvoidList=[]
  ngOnInit(): void {
    this.semesterList = [];
    let arr = [];
    var courseNames = [];
    this.courseServices.getCourses().subscribe(s => {
      s.forEach(element => {
          arr.push(element);
      });
      for (let i = 0; i < arr.length; i++) {
        courseNames.push(arr[i].course.substring(0,6));
      }
      var coursesNamesSet = new Set(courseNames);
      var courseNamesSetArray = Array.from(coursesNamesSet);
      this.courseNames = courseNamesSetArray;
    });
    this.courses = arr;
    this.coursesCopy = arr;
    this.router.routerState.root.queryParams.subscribe(params => {
      this.sbuID = params['sbuID'];
    });
    this.afs.collection('Students').doc(this.sbuID).valueChanges().subscribe(val => {
      this.s = val;
      this.gradSemester = this.s.gradSemester;
      this.gradYear = this.s.gradYear;
      for (let i = 2021; i <= parseInt(this.s.gradYear); i++) {
        if (i == 2021) {
          if (this.s.gradSemester === 'Spring' && this.s.gradYear === '2021') {
            return;
          } else {
            this.semesterList.push('Fall ' + i.toString());
          }
        } else {
          if (i == parseInt(this.s.gradYear)) {
            if (this.s.gradSemester === 'Spring') {
              this.semesterList.push('Spring ' + i.toString());
              return;
            } else {
              this.semesterList.push('Spring ' + i.toString());
              this.semesterList.push('Fall ' + i.toString());
              return;
            }
          } else {
            this.semesterList.push('Spring ' + i.toString());
            this.semesterList.push('Fall ' + i.toString());
          }
        }
      }
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
    for (let i = 0; i < this.coursesToAddList.length; i++) {
      if (course === this.coursesToAddList[i].courseName) {
        return;
      }
    }
    this.coursesToAddList = this.coursesToAddList.concat({courseName: course, weight: 1}); 
  }

  addItemAvoid(event): void{
    var course = event.value;
    for (let i = 0; i < this.coursesToAvoidList.length; i++) {
      if (course === this.coursesToAddList[i].courseName) {
        return;
      }
    }
    this.coursesToAvoidList = this.coursesToAvoidList.concat({courseName: course}); 
  }

  checkboxCheck() {
    var cb = document.getElementById("weightCheckbox") as HTMLInputElement;
    if (cb.checked == false) {
      this.courseAdd = ['courseName'];
    } else {
      this.courseAdd = ['courseName', 'weight', 'actions'];
    }
  }

  moveUp(row): void{
    var index = -1;
    for (let i = 0; i < this.coursesToAddList.length; i++) {
      if (row.courseName === this.coursesToAddList[i].courseName) {
        index = i;
      }
    }
    if (index !== 0) {
      const tmp = this.coursesToAddList[index]
      this.coursesToAddList[index] = this.coursesToAddList[index - 1]
      this.coursesToAddList[index - 1] = tmp
    }
    this.table.renderRows()
  }

  moveDown(row): void{
    var index = -1;
    for (let i = 0; i < this.coursesToAddList.length; i++) {
      if (row.courseName === this.coursesToAddList[i].courseName) {
        index = i;
      }
    }
    if (index !== (this.coursesToAddList.length - 1)) {
      const tmp = this.coursesToAddList[index]
      this.coursesToAddList[index] = this.coursesToAddList[index + 1]
      this.coursesToAddList[index + 1] = tmp
    }
    this.table.renderRows()
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
    let years_left = parseInt(this.gradYear) - 2021;
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
    for (let i = 0; i < required_courses.length; i++) {
      var array = [];
      var max = -1;
      this.courseServices.getCourseByName(required_courses[i].substring(0,3), required_courses[i].substring(3,6)).subscribe(s => {
        for (let j = 0; j < s.length; j++) {
          if (true) {
            array = [];
            //max = parseInt(s[j].year);
            array.push(s[j])
          } 
        }
      });
    }

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
