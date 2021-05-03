import { Courses } from './../../models/courses';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument  } from '@angular/fire/firestore';
import { StudentRequirementsService } from 'src/app/services/student-requirements.service';
import { Student } from '../../models/student';
import { StudentService } from 'src/app/services/student.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'app-view-course-plan',
  templateUrl: './view-course-plan.component.html',
  styleUrls: ['./view-course-plan.component.css']
})
export class ViewCoursePlanComponent implements OnInit {
  coursePlan;
  dept: String;
  courseView: string[] = ['name', "sem", "grade"];
  s:Student;
  sbuID: string;
  whosLoggedIn: string;
  dataSource: MatTableDataSource<any>
  @ViewChild(MatSort) sort: MatSort;

  constructor(private authService: AuthService, public studentService: StudentService, public router: Router, public afs: AngularFirestore, public sr: StudentRequirementsService) {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['login'])
    }
   }

  ngOnInit(): void {
    this.whosLoggedIn = localStorage.getItem('userType')
    this.router.routerState.root.queryParams.subscribe(params => {
      this.sbuID = params['sbuID'];
    })
    this.afs.collection('Students').doc(this.sbuID).ref.get().then(val => {
      this.s = val.data();
  
      
      var courseArr = []
      var map : Map<string, Map<string, string>> = new Map(Object.entries(this.s.coursePlan))
      var keys = Object.keys(this.s.coursePlan);
      for(var semesterYear of map.keys()){
        var innerMap : Map<string, string> = new Map(Object.entries(map.get(semesterYear)))
        var semester = semesterYear.slice(0, semesterYear.length - 3);
        var year = semesterYear.slice(semesterYear.length - 4);
        for(var c of innerMap.keys()){
          var grade = innerMap.get(c);
          if(grade === ""){
            grade = "No grade yet"
          }
          var course: Courses = {
            year: parseInt(year),
            semesterYear : semesterYear, 
            course: c, 
            grade:grade
          }
          courseArr.push(course);
        }
      }
      courseArr.sort(function(a:Courses,b:Courses){
        if(a.year === b.year){
          return a.semesterYear.localeCompare(b.semesterYear) ? 1 : -1;
        }
        return a.year > b.year ? 1: -1;
      })
      console.log(courseArr)
      this.dataSource = new MatTableDataSource(courseArr);
      console.log(this.dataSource)

    });

  }
  ngAfterInit(): void{
    location.reload();
  }
}