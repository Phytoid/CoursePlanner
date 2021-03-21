import { StudentService } from './../../services/student.service';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router } from  "@angular/router";
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-gpd',
  templateUrl: './gpd.component.html',
  styleUrls: ['./gpd.component.css']
})
export class GpdComponent implements OnInit {
  constructor(private authService: AuthService, public router: Router, public studentService: StudentService) {
    if (this.authService.isLoggedIn == false) {
      this.router.navigate(['login'])
    }
  }

  ngOnInit(): void {
  }

  onDelete(){
    if(confirm("Are you sure you want to delete all students?")){
      this.studentService.getStudents().subscribe(students => {
        console.log(students)
      })
    }

    // this.students = this.db.collection("Persons").child("Students").on('value', (shapshot) => {
    //   shapshot.forEach((child) => {
         
    //       console.log(child.val())
    //       // if(child.ref.remove()){
    //       //   console.log("Delete");
    //       // };
    //   })
    // })
  }

  logout() {
    this.authService.logout()
  }
}

