import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { yearsPerPage } from '@angular/material/datepicker';
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
 

  public years = [];
  
  

  display: boolean = false;

  courses_to_display = [];
  semesters_to_display = [];
  
  public colors = [
    '#1f77b4',  // muted blue
    '#ff7f0e',  // safety orange
    '#2ca02c',  // cooked asparagus green
    '#d62728',  // brick red
    '#9467bd',  // muted purple
    '#8c564b',  // chestnut brown
    '#e377c2',  // raspberry yogurt pink
    '#7f7f7f',  // middle gray
    '#bcbd22',  // curry yellow-green
    '#17becf'   // blue-teal
  ];

  arr: any = [];
  public graph =  
  { 
    data: [
          
    ],
    layout: {
      xaxis: {'tickformat':',d',rangemode:'tozero'},
      yaxis: {'tickformat':',d',rangemode:'tozero'},
      autosize: true, 
      title: 'Course Enrollment Trends'
    }
  };

  constructor(private authService: AuthService, public router: Router, public afs: AngularFirestore, public studentService: StudentService) {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['login'])
    }
  }

  ngOnInit(): void {
    
    for(var i = (new Date().getFullYear()) + 1;i>=1970;i--) {
      this.years.push(i);
    }
    console.log(this.years);
    this.studentService.getStudents().subscribe(s => {
      
      s.forEach(element => { 
          this.arr.push(element);
      });
    });
  }

  addCourse(event) {
    
    this.semesters_to_display = [];

    //let department = ((<HTMLInputElement>document.getElementById("mat-input-0")).value);
    let course = ((<HTMLInputElement>document.getElementById("course")).value.toUpperCase());
    if(course.length == 0) {
      alert("No Course Entered.");
      return;
    }

    let semester_start = ((<HTMLInputElement>document.getElementById("mat-input-0")).value);
    let semester_end = ((<HTMLInputElement>document.getElementById("mat-input-1")).value);

  
    let year_start = parseInt(((<HTMLInputElement>document.getElementById("mat-input-2")).value));
    let year_end = parseInt(((<HTMLInputElement>document.getElementById("mat-input-3")).value));

    if(year_end < year_start) {
      alert("Ending Year must be after Starting Year.");
    }

    if(year_start == year_end && semester_start == "fall" && semester_end == "spring") {
      alert("Spring Semester comes before Fall Semester.");
    }

    // Get semesters to display

    var year = year_start;
    var semester = semester_start;
    while(true) {
      
      if(year > year_end) {
        break;
      } else if(year == year && (semester == "fall" && semester_end == "spring" )) {
        break;
      }
      //console.log(semester + " " + year);
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

    //console.log(this.semesters_to_display);
    
    this.courses_to_display.push(course);

    var amount_of_class = 0;

    var course_enrollment = new Array(this.semesters_to_display.length).fill(0);

    var plot_data = {
      x: this.semesters_to_display,
      y: course_enrollment,
      type: 'scatter',
      mode:'lines+markers',
      name: course,
      marker: {color: this.colors[this.courses_to_display.length - 1]},
      hoverinfo:'x+y+name',
    };

    console.log(course_enrollment);
    

    this.arr.forEach(student => { // loop through each student
      
      let plan = student.coursePlan;
      if(plan != undefined) {
        var i = -1;
        for(var sem in plan) { // go through each semester in course plan
          i++;
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
            console.log(classes_for_semester);
            for(var student_class in classes_for_semester) {
              let split = student_class.toString().split(/(\d+)/)
              
              let dept_class_num = split[0] + " " + split[1];
              
              if(dept_class_num == course) { 
                //console.log("FOUND: " + student.id + " " + course + " "+ dept_class_num + " " + season);
                //console.log(student.id);
                course_enrollment[index_to_add]++;
                amount_of_class++;
              }
            }
            
          }
          
          
        }
        
      }
      
    });
    this.graph.data.push(plot_data);
    console.log(course_enrollment);
    console.log(amount_of_class);
    
    
  }
  

  resetChart(event) {
    this.courses_to_display = [];
    this.semesters_to_display = [];
    this.graph.data = [];
  }

}


