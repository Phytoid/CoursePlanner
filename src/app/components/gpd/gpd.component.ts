import { StudentService } from './../../services/student.service';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router } from  "@angular/router";
import { AuthService } from 'src/app/auth/auth.service';
import { Student } from 'src/app/models/student';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-gpd',
  templateUrl: './gpd.component.html',
  styleUrls: ['./gpd.component.css']
})
export class GpdComponent implements OnInit {
  s: Student[];
  students: Observable<Student[]>;
  constructor(private authService: AuthService, public router: Router, public studentService: StudentService, public afs: AngularFirestore) {
    if (this.authService.isLoggedIn == false) {
      this.router.navigate(['login'])
    }
  }

  ngOnInit(): void {
    this.studentService.getStudents().subscribe(s => {
      this.s = s;
    })
    // this.students = this.afs.collection('GPD').snapshotChanges().pipe(map(changes => {
    //   return changes.map(a => {
    //     const data = a.payload.doc.data() as Student;
    //     data.id = a.payload.doc.id;
    //     return data;
    //   })
    // }))
    // this.students.subscribe(s => {
    //   this.s = s;
    // })
  }

  onDelete(){
    if(confirm("Are you sure you want to delete all students?")){
      //  this.studentService.getStudents().subscribe(s => {
      //   this.students = s;
      // })
      this.s.forEach(element => {
        //console.log(element.id);
        this.afs.collection('GPD').doc(element.id).delete();
        
      });
      this.s = [];
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

