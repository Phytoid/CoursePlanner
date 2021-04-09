import { Plan } from './../../models/plan';
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

  async uploadStudentData(event) {
    console.log("upload student!\n");
    let fileList: FileList = event.target.files;
    if(fileList.length != 2) {
      alert("Importing Student Data Requires Two Files: One For Student Information And One For Course Plans.");
      return;
    }
    let course_data_header = "sbu_id,department,course_num,section,semester,year,grade";
    let student_data_header = "sbu_id,first_name,last_name,email,department,track,entry_semester,entry_year,requirement_version_semester,requirement_version_year,graduation_semester,graduation_year,password";

    let text1 =  (await fileList.item(0).text()).split(/\r?\n/); // sbu_id,first_name,last_name,email,department,track,entry_semester,entry_year,requirement_version_semester,requirement_version_year,graduation_semester,graduation_year,password
    let text2 =  (await fileList.item(1).text()).split(/\r?\n/); // sbu_id,department,course_num,section,semester,year,grade1
    
    var course_data = 0;
    var student_data = 0;

    if(text1[0] == course_data_header) {
      course_data++;
    } else if(text1[0] == student_data_header) {
      student_data++;
    } 

    if(text2[0] == course_data_header) {
      course_data++;
    } else if(text2[0] == student_data_header) {
      student_data++;
    } 

    console.log(course_data);
    console.log(student_data);

    if(course_data > 1 || student_data > 1) {
      alert("Both files are of the same type.")
      return;
    } else if (course_data < 1 || student_data < 1) {
      alert("One or more files were not of the right format");
      return;
    }
    
    // Parse Course Plan Information
    for (var i = 0; i < text1.length; i++) {
      
    }

    // Parse Student Information
    for (var i = 0; i < text2.length; i++) {
      if (text2[i] == student_data_header) {
        continue;
      } else if (text2[i] == "") {
        continue;
      } else {
        var str_array = text2[i].split(",")
        if (str_array.length != 13) {
          if (str_array.length < 13) {
            // Popup that insufficient number of fields.
          } else {
            let open_quotes = -1
            let close_quotes = -1
            for (var j = 0; j < str_array.length; j++) {
              if (str_array[j].startsWith("\"")) {
                open_quotes = j;
              }
              if (str_array[j].endsWith("\"")) {
                close_quotes = j;
              }
            }
            if (open_quotes !== -1 && close_quotes !== -1) {
              var subset = str_array.slice(open_quotes, close_quotes + 1)
              var str = subset.join("")
              str_array[open_quotes] = str
              console.log(str_array)
              str_array.splice(open_quotes + 1, close_quotes - open_quotes)
              console.log(str_array)
              open_quotes = -1
              close_quotes = -1
            }
          }
        }
        var students = [];
        this.studentService.getStudents().subscribe(student => {
          student.forEach(element => {
            if (element.id == str_array[0]) {
              students.push(element);
            }
          });
        });
        console.log(this.gpd);
        console.log(str_array[4]);
        if (str_array[4].toLocaleLowerCase() !== this.gpd.toLocaleLowerCase()) {
          continue;
        }
        console.log(students.length);
        if (students.length > 0) {
          for (i = 0; i < students.length; i++) {
            students[i].first = str_array[1];
            students[i].last = str_array[2];
            students[i].id = str_array[0];
            students[i].sbuID = str_array[0];
            students[i].email = str_array[3];
            students[i].dept = str_array[4];
            students[i].track = str_array[5];
            students[i].entrySemester = str_array[6];
            students[i].entryYear = str_array[7];
            students[i].reqVersionSemester = str_array[8];
            students[i].reqVersionYear = str_array[9];
            students[i].gradSemester = str_array[10];
            students[i].gradYear = str_array[11];
          }
        } else {
          var st: Student = {first : str_array[1], last : str_array[2], id : str_array[0], sbuID: str_array[0], email : str_array[3], dept : str_array[4], track : str_array[5], entrySemester : str_array[6], entryYear : str_array[7], reqVersionSemester : str_array[8], reqVersionYear : str_array[9], gradSemester : str_array[10], gradYear : str_array[11], comments : []};
          this.afs.firestore.collection('Students').doc(st.id).set(st);
        }
      }
    }
  }

  async uploadGrade(event) {
    console.log("upload grades!\n");
    let fileList: FileList = event.target.files;
    if(fileList.length != 1) {
      alert("Importing Student Grades Requires One File.");
      return;
    }
    let course_data_header = "sbu_id,department,course_num,section,semester,year,grade";

    let grades =  (await fileList.item(0).text()).split(/\r?\n/); // sbu_id,department,course_num,section,semester,year,grade1
    
    if(grades[0] != course_data_header) {
      alert("Grades File Does Not Match Format.");
      return;
    } 

    for(var i = 1; i < grades.length; i++) {
      
      let line = grades[i].split(',');
      let studentID = line[0];
      let department = line[1];
      let courseID = line[2];
      let section = line[3];
      let semester = line[4];
      let year = line[5];
      let grade = line[6];
      console.log(line);

    
      let semester_and_year = semester+year;
      let course = department + courseID;
      console.log(semester_and_year);

      var updateGrade = {}
      

      this.afs.collection('Students').doc(studentID).collection('coursePlan').doc('coursePlan').update({
        [semester_and_year + '.' + course] : `${grade}`
      }).then(() => {

      }).catch((error) => {
        console.log("Student ID: " + studentID + " does not exist.");
      });
      
    }

  }

  async uploadDegreeReqs(event) {

  }
  async uploadCourse(event) {
    console.log("upload Courses!\n");
    let fileList: FileList = event.target.files;
    let course_data_header = "department,course_num,section,semester,year,timeslot";
    let text =  (await fileList.item(0).text()).split(/\r?\n/);
    console.log(text);
    for(var i = 0; i < text.length; i++){
      if (text[i] == course_data_header) {
        continue;
      } else if (text[i] == "") {
        continue;
      } else {
        var str_array = text[i].split(",")
        console.log(str_array);
        var id = str_array[0] + str_array[1];
        id = id.replace(/\s+/g, '');
        var courseID = str_array[1];
        var section = str_array[2];
        var semester = str_array[3];
        var year = str_array[4];
        var timeSlot = str_array[5];
        var time_array = timeSlot.split(" ");
        var days = time_array[0];
        var times = time_array[1].split("-");
        var startTime = times[0];
        var endTime = times[1];
        console.log(id);
        this.afs.collection("Courses").doc(id).set({
        courseID: courseID,
        section: section,
        semester: semester,
        year: year,
        day: days,
        startTime: startTime,
        endTime: endTime
        })
        .then(() => {
            console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
          
        
      }
    }
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

