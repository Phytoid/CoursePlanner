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
  gpd: String;
  constructor(private authService: AuthService, public router: Router, public studentService: StudentService, public afs: AngularFirestore) {
    if (!this.authService.isLoggedIn || localStorage.getItem('userType') != 'GPD') {
      this.router.navigate(['login'])
    }
  }

  ngOnInit(): void {
    this.gpd = 'ESE';
    if(localStorage.getItem('gpdType') == 'AMS'){
      this.gpd = 'AMS';
    }
    else if(localStorage.getItem('gpdType') == 'CSE'){
      this.gpd = 'CSE';
    }
    else if(localStorage.getItem('gpdType') == 'BMI'){
      this.gpd = 'BMI';
    }
    this.studentService.getStudents().subscribe(s => {
      var arr: any = []
      s.forEach(element => {
        if(element.dept == this.gpd){
          arr.push(element);
        }  
      });
      this.s = arr;
    });
  }

  onDelete(){
    if(confirm("Are you sure you want to delete all students?")){
      this.s.forEach(element => {
        this.afs.collection('Students').doc(element.id).delete();
      });
      this.s = [];
    }

  }

  logout() {
    this.authService.logout()
  }
}

