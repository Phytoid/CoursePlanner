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
            let open_quotes = 0
            let close_quotes = 0
            for (var j = 0; j < str_array.length; j++) {
              if (str_array[j].startsWith("\"")) {
                open_quotes++;
              }
              if (str_array[j].endsWith("\"")) {
                close_quotes;;
              }
            }
            if ((open_quotes == close_quotes) && (str_array.length - open_quotes == 13)) {
              let starting_index = -1
              let closing_index = -1
              for (var j = 0; j < str_array.length; j++) {
                if (str_array[j].startsWith("\"")) {
                  starting_index = j
                }
                if (str_array[j].endsWith("\"")) {
                  closing_index = j
                  if (starting_index != -1) {
                    var subset = str_array.slice(starting_index, closing_index + 1)
                    var str = subset.join(" ")
                    str_array[starting_index] = str
                    str_array = str_array.splice(closing_index - starting_index, starting_index + 1)
                    starting_index = -1
                    closing_index = -1
                  }
                }
              }
            } else {
              // Popup that number of fields is incorrect.
            }
          }
        }
        //this.s = {
        // first: str_array[1],
        //  last: str_array[2],
        //  id: parseInt(str_array[0]),
        //  sbuID: parseInt(str_array[0]),
        //  email: str_array[3],
        //  dept: str_array[4],
        //  track: str_array[5],
        //  entrySemester: str_array[6],
        //  entryYear: parseInt(str_array[7]),
        //  reqVersionSemester: str_array[8],
        //  reqVersionYear: parseInt(str_array[9]),
        //  gradSemester: str_array[10],
        //  gradYear: parseInt(str_array[11]),
        //}
      }
    }
  }

  async uploadGrade(event) {

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

