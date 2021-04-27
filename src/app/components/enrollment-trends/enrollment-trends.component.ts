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

  courses_to_display = [];
  semesters_to_display = [];
  

  arr: any = [];
  public graph =  { data: [
          
  ],
  layout: {width: 640, height: 480, title: 'Course Enrollment Trends'}
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
    
    this.semesters_to_display = [];

    console.log("add course!\n");
    

    
    let department = ((<HTMLInputElement>document.getElementById("mat-input-0")).value);
    let course = ((<HTMLInputElement>document.getElementById("mat-input-1")).value);

    let semester_start = ((<HTMLInputElement>document.getElementById("mat-input-2")).value);
    let semester_end = ((<HTMLInputElement>document.getElementById("mat-input-3")).value);

  
    let year_start = parseInt(((<HTMLInputElement>document.getElementById("mat-input-4")).value));
    let year_end = parseInt(((<HTMLInputElement>document.getElementById("mat-input-5")).value));

    // Get semesters to display

    
    
      

    
    var year = year_start;
    var semester = semester_start;
    while(true) {
      
      if(year > year_end) {
        break;
      } else if(year == year && (semester == "fall" && semester_end == "spring" )) {
        break;
      }
      console.log(semester + " " + year);
      this.semesters_to_display.push(semester + " " + year);
      if(semester == "spring") {
        semester = "fall";
      } else if(semester == "fall") {
        semester = "spring";
        year = year + 1;
      }
      
      if(this.semesters_to_display.includes(semester + " " + year))
        continue;
     
      

    }

   
    console.log(this.semesters_to_display);
    

    this.courses_to_display.push(course);

    var amount_of_class = 0;

    var course_enrollment = new Array(this.semesters_to_display.length).fill(0);

    var plot_data = {
      x: this.semesters_to_display,
      y: course_enrollment,
      type: 'scatter',
      mode:'lines',
      name: course,
      marker: {color: 'red'},
      hoverinfo:'x+y+name',
    };



    //this.graph =  { data: [
    //      { x: this.semesters_to_display, y: course_enrollment, type: 'scatter', mode: 'lines+points', marker: {color: 'red'} }
    //    ],
    //    layout: {width: 640, height: 480, title: 'Course Enrollment Trends'}
    //};

   

    
    

    console.log(course_enrollment);
    

    this.arr.forEach(student => { // loop through each student
      
      let plan = student.coursePlan;
      if(plan != undefined) {
        var i = 0;
        for(var sem in plan) { // go through each semester in course plan
         
          
          let split = sem.toString().toLowerCase().split(/(\d+)/)
          let season = split[0];
          let year = parseInt(split[1]);
          
          var index_to_add = this.semesters_to_display.indexOf(season + " " + year);
          if(index_to_add < 0)
            continue;
          
          if(year == year_end)
          {
            if(semester_end == "spring" && season == "fall")
                continue;
            if(semester_start == "fall" && season == "spring")
                continue;
            
          }

          if(year <= year_end && year >= year_start) {
          
            var classes_for_semester = plan[Object.keys(plan)[i]];
            for(var student_class in classes_for_semester) {
              let split = student_class.toString().toLowerCase().split(/(\d+)/)
              
              let dept_class_num = split[0] + " " + split[1];
            
              if(dept_class_num == course) { 
                console.log(student.id);
                course_enrollment[index_to_add]++;
                amount_of_class++;
              }
            }
            
          }
          i++;
          
        }
        
      }
      
    });
    this.graph.data.push(plot_data);
    console.log(course_enrollment);
    console.log(amount_of_class);
    
    
  }
  
  viewChart(event) {
    console.log("add course!\n");
    this.display = true;
  }

}


