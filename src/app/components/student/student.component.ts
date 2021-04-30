import { Student } from './../../models/student';
import { Component, OnInit } from '@angular/core';
import { Router } from  "@angular/router";
import { AuthService } from 'src/app/auth/auth.service';
import { StudentService } from 'src/app/services/student.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {
  studentName: string;
  student: Student;
  email: string;
  students: Student[];
  isLoaded: Boolean = false;

  constructor(private authService: AuthService, public router: Router, public studentService: StudentService, public afs: AngularFirestore) {
    if (!this.authService.isLoggedIn || localStorage.getItem('userType') != 'Student') {
      this.router.navigate(['login'])
    }
  }

  ngOnInit(): void {

    this.email = localStorage.getItem('email');
    this.afs.collection('Students').doc(localStorage.getItem('sbuID')).valueChanges().subscribe(val => {
      console.log(val);
      this.student = val;
    });
  }

  ngAfterInit(): void{
    location.reload();
  }

  logout() {
    this.authService.logout()
  }
}
