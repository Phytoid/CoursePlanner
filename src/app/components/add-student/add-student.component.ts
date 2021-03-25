import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { NgbDateStruct, NgbCalendar, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';

import { Student } from '../../models/student';


@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css']
})




export class AddStudentComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  error: string;
  s:Student;
  tracks:String[]
  dept: String;
  model: NgbDateStruct;
  date: { year: number};
  @ViewChild('dp') dp: NgbDatepicker;

  constructor(private authService: AuthService, public router: Router, public afs: AngularFirestore) {
    if (!this.authService.isLoggedIn || localStorage.getItem('userType') != 'GPD') {
      this.router.navigate(['login'])
    }
  }

  ngOnInit(): void {
    this.dept = localStorage.getItem('gpdType');
  }

  addStudent(event) {
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
    this.s.comments = [];
    this.s.comments.push(event.srcElement[22].value);

    this.afs.firestore.collection('Students').doc(this.s.id).set(this.s);
    this.router.navigate(['search']);
  }

  getTrack(event){
    document.getElementById("track").style.display = "inline" 
    var dept = event.srcElement.value;
    if(dept == "BMI"){
      this.tracks = ["Imaging, Thesis", "Imaging, Proj.", "Clinical, Thesis", "Clinical, Proj.", "Translational, Thesis", "Translational, Proj."];
    }
    else if(dept == "AMS"){
      this.tracks = ["CAM", "CB", "OR", "STAT", "QF"];
    }
    else if(dept == "ESE"){
      this.tracks = ["Non-Thesis", "Thesis"]
    }
    else{
      this.tracks = ["Advanced Proj.", "Special Proj.", "Thesis"]
    }
  }

}
