import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from  "@angular/router";
import { PlotlyModule } from 'angular-plotly.js';
import { AuthService } from 'src/app/auth/auth.service';
import { StudentService } from 'src/app/services/student.service';


@Component ({
  selector: 'app-enrollment-trends',
  templateUrl: './enrollment-trends.component.html',
  styleUrls: ['./enrollment-trends.component.css']
  
})

export class EnrollmentTrendsComponent implements OnInit {
  display: boolean = false;
  arr: any = [];
  public graph = { data: [
      { x: ["CSE 101", "AMS 102"], y: [2, 6, 3], type: 'scatter', mode: 'lines+points', marker: {color: 'red'} }
    ],
    layout: {width: 320, height: 240, title: 'Course Enrollment Trends'}
  };
  constructor(private authService: AuthService, public router: Router, public afs: AngularFirestore, public studentService: StudentService) {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['login'])
    }
  }

  ngOnInit(): void {
    
    this.studentService.getStudents().subscribe(s => {
      
      s.forEach(element => { 
          this.arr.push(element);
      });
    });
  }




  addCourse(event) {
    console.log("add course!\n");
    this.display = true;

    //this.graph = {
    //  data: [
    //     { x: [1, 2, 3], y: [2, 6, 3], type: 'scatter', mode: 'lines+points', marker: {color: 'red'} },
    //      { x: [1, 2, 3], y: [2, 5, 3], type: 'bar' },
    // ],
    //  layout: {width: 320, height: 240, title: 'A Fancy Plot'}
    //};
    let department = ((<HTMLInputElement>document.getElementById("mat-input-0")).value);
    let course = ((<HTMLInputElement>document.getElementById("mat-input-1")).value);

    let semester_start = ((<HTMLInputElement>document.getElementById("mat-input-2")).value);
    let semester_end = ((<HTMLInputElement>document.getElementById("mat-input-3")).value);

    let year_start = ((<HTMLInputElement>document.getElementById("mat-input-4")).value);
    let year_end = ((<HTMLInputElement>document.getElementById("mat-input-5")).value);

   // console.log(semester_start + " " + year_start);
   // console.log(semester_end + " " + year_end);

   var amount_of_class = 0;
    
    this.arr.forEach(student => {
      let plan = student.coursePlan;
      if(plan != undefined) {
        var i = 0;
        for(var sem in plan) {
          let split = sem.toString().toLowerCase().split(/(\d+)/)
          let season = split[0];
          let year = split[1];
         //console.log(season); // text
         // console.log(year); // year

          if(year <= year_end && year >= year_start) {
           
            var classes_for_semester = plan[Object.keys(plan)[i]];
            for(var student_class in classes_for_semester) {
              let split = student_class.toString().toLowerCase().split(/(\d+)/)
              
              let dept_class_num = split[0] + " " + split[1];
            
              if(dept_class_num == course) { 
                amount_of_class++;
              }
            }
            
          }
          i++;
          
        }
        
      }
      
    });
   
    console.log(amount_of_class);
    
    
  }

}
