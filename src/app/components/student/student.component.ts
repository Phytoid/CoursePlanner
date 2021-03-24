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

  constructor(private authService: AuthService, public router: Router, public studentService: StudentService, public afs: AngularFirestore) {
    if (!this.authService.isLoggedIn || localStorage.getItem('userType') != 'Student') {
      console.log(localStorage.getItem('userType'));
      this.router.navigate(['login'])
    }
    //this.student = this.authService.getStudent();
    // this.email = this.authService.getEmail();
    // this.studentService.getStudents().subscribe(s => {
    //   console.log(s);
    //   this.students = s;
    //   for(var i = 0; i < this.students.length; i++){
    //     if(this.students[i].email == this.email){
    //       this.student = this.students[i];
    //       this.studentName = this.student.first + " " + this.student.last;
    //     }
    //   }
    // });
  }

  ngOnInit(): void {
    //this.student = this.authService.getStudent();
  }


  logout() {
    this.authService.logout()
  }
}
