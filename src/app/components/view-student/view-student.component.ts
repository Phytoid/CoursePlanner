import { BrowserModule } from '@angular/platform-browser';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { first, map } from 'rxjs/operators';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument  } from '@angular/fire/firestore';
import { NgbDateStruct, NgbCalendar, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';

import { Student } from '../../models/student';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-view-student',
  templateUrl: './view-student.component.html',
  styleUrls: ['./view-student.component.css']
})
export class ViewStudentComponent implements OnInit {
  tracks:String[];
  dept: String
  model: NgbDateStruct;
  date: { year: number};
  s:Student;
  @ViewChild('dp') dp: NgbDatepicker;
  sbuID: string;
  studentObs: Observable<Student>;
  comments: string[] = [];
  whosLoggedIn: string;

  constructor(private authService: AuthService, public router: Router, public afs: AngularFirestore) {
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
      this.s = val;
      this.model = {year: parseInt(this.s.gradYear), day: 1, month: 1};
      this.comments = this.s.comments;
      this.dept = this.s.dept
    });

    // this.studentObs.subscribe(val => {
    //   this.s = val;
    //   console.log(val);
    //   console.log(this.s);
    // });
    if(this.whosLoggedIn == 'GPD'){
      this.dept=localStorage.getItem('gpdType');
    }
    this.getTrack();
  }
  ngAfterInit(): void{
    location.reload();

  }
  editStudent(event) {
    if(confirm("Are you sure you want to edit this information?")){
      this.s = {
        first: event.srcElement[0].value,
        last: event.srcElement[1].value,
        id: event.srcElement[2].value,
        sbuID: event.srcElement[2].value,
        email: event.srcElement[3].value,
        dept: event.srcElement[4].value,
        track: event.srcElement[5].value,
        entrySemester: event.srcElement[6].value,
        entryYear: event.srcElement[9].value,
        reqVersionSemester: event.srcElement[11].value,
        reqVersionYear: event.srcElement[14].value,
        gradSemester: event.srcElement[16].value,
        gradYear: event.srcElement[19].value,
        advisor: event.srcElement[21].value,
        satisfied: 0,
        pending: 0,
        unsatisfied: 0,
        semesters: 0,
        graduated: false,
        validCoursePlan: true,
      }
      console.log(event.srcElement[22].value)
      if(event.srcElement[22].value.trim().length > 0){
        this.comments.push(event.srcElement[22].value);
      }
      this.s.comments = this.comments;
      this.afs.firestore.collection('Students').doc(this.s.id).set(this.s);
      if(this.whosLoggedIn != "Student"){
        this.router.navigate(['search']);
      }
      else{
        this.router.navigate(['student']);
      }
    }
    
  }

  deleteComment(event){
    var index = this.comments.indexOf(event);
    this.comments.splice(index, 1);
    this.s.comments = this.comments;
    this.afs.firestore.collection('Students').doc(this.s.id).set(this.s);
  }

  deleteStudent(){
    if(confirm("Are you sure you want to delete this student from the database?")){
      this.afs.collection('Students').doc(this.s.id).delete()
      this.router.navigate(['search']);
    }
  }

  getTrack(){
    document.getElementById("track").style.display = "inline" 
    if(this.dept == "BMI"){
      this.tracks = ["Imaging, Thesis", "Imaging, Project", "Clinical, Thesis", "Clinical, Project", "Translational, Thesis", "Translational, Project"];
    }
    else if(this.dept == "AMS"){
      this.tracks = ["CAM", "CB", "OR", "STAT", "QF"];
    }
    else if(this.dept == "ESE"){
      this.tracks = ["Non-Thesis", "Thesis"]
    }
    else{
      this.tracks = ["Advanced Project", "Special Project", "Thesis"]
    }
  }

}
