import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

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

  constructor(private authService: AuthService, public router: Router, public afs: AngularFirestore) {
    if (this.authService.isLoggedIn == false) {
      this.router.navigate(['login'])
    }
  }

  ngOnInit(): void {
  }

  addStudent(event) {
    console.log("Adding Student!")
    
    
    this.s = {
      id: event.srcElement[2].value,
      sbuID: event.srcElement[2].value,
      last: event.srcElement[1].value,
      first: event.srcElement[0].value,
      dept: event.srcElement[4].value,
      track: event.srcElement[5].value,
      satisfied: 0,
      pending: 0,
      unsatisfied: 0,
      gradSemester: event.srcElement[11].value,
      gradYear: event.srcElement[12].value,
      semesters: event.srcElement[6].value,
      graduated: false,
    }
    this.afs.firestore.collection('Students').doc(this.s.id).set(this.s);
    this.router.navigate(['search']);
  }

}
