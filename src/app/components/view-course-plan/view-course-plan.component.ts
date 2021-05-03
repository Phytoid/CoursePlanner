import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument  } from '@angular/fire/firestore';
import { StudentRequirementsService } from 'src/app/services/student-requirements.service';
import { Student } from '../../models/student';
import { StudentService } from 'src/app/services/student.service';

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
    this.afs.collection('Students').doc(this.sbuID).valueChanges().subscribe(val => {
      //this.coursePlan = this.s.coursePlan;
    });
    //console.log(this.dept);
  }
}
