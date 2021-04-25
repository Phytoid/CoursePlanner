import { CourseService } from './../../services/course.service';
import { Semester } from './../../models/semester.enum';
import { Courses } from './../../models/courses';
import { Plan } from './../../models/plan';
import { StudentService } from './../../services/student.service';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router } from  "@angular/router";
import { AuthService } from 'src/app/auth/auth.service';
import { Student } from 'src/app/models/student';
import { Grade } from "src/app/models/grade.enum";
import { map } from 'rxjs/operators';

import bcrypt from 'bcryptjs';

@Component({
  selector: 'app-gpd',
  templateUrl: './gpd.component.html',
  styleUrls: ['./gpd.component.css']
})

export class GpdComponent implements OnInit {
  s: Student[];
  gpd: String;
  constructor(private authService: AuthService, public router: Router, public studentService: StudentService, public afs: AngularFirestore, public courseService: CourseService) {
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

  async scrapeCourseInfo(event){
    let fileList: FileList = event.target.files;
    if(fileList.length != 1) {
      alert("Importing student data requires one file");
      return;
    }
    let text2 = (await fileList.item(0).text()).replace(/^Stony.*$/gm, '')
    let index = text2.indexOf('\n');
    let firstLine = text2.substring(0,index).replace(/\t/g, ' ');;
    let arrFirstLine = firstLine.split(' ');
    let currentSemester = arrFirstLine[arrFirstLine.length - 2];
    let currentYear = arrFirstLine[arrFirstLine.length - 1];
    console.log(currentSemester);
    console.log(currentYear);
    text2 = text2.replace(/^GRADUATE.*$/gm, '');
    text2 = text2.replace(/^Offered.*$/gm, '');
    text2 = text2.replace(/\r?\n\s/g, '');
    text2 = text2.replace(/\s\s/g, ' ');
    text2 = text2.replace(/^([A-Z][A-Z][A-Z]\r?\n)/g, '');
    text2 = text2.replace(/^([A-Z][A-Z][A-Z]\s[0-9][0-9][0-9]\s)/gm, '')
    text2 = text2.replace(/^Prerequisite /gm, 'Prerequisite:')
    // text2 = text2.replace(/)
    // text2 = text2.replace(/^(?![A-Z][A-Z][A-Z]).+(\r?\n)?/gm, '');
    let text1 = text2.split(/\r?\n/);
    let course:Courses;
    let courseID = null;
    let major = "";
    let courseName = "";
    let description = "";
    let prereq = "";
    let semesters = "";
    let credits = "";
    const regex = /^([A-Z][A-Z][A-Z]\s[0-9][0-9][0-9]:)/;
    const prereqRegex = /^Prerequisite/;
    const fallRegex = /^Fall/;
    const springRegex = /^Spring/;
    const creditRegix = /^[0-9]/;
    let arr = []
    for(const line of text1){
      if(regex.test(line)){
        if(courseID != null){
          
          course = {courseID: courseID, courseName: courseName, description: description};
          course.courseID = courseID;
          course.courseName = courseName.trim();
          course.courseName = course.courseName.replace(/undefinded/, '')
          course.description = description;
          course.course = major + courseID;
          course.department = major;
          if(credits == ""){
            course.credits = 3;
          }
          else{
            var c = parseInt(credits)
            if(c != NaN){
              course.credits = c
            }
            else{
              course.credits = 3;
            }
          }
          if(semesters.includes("Fall") && semesters.includes("Spring")){
            course.semester = Semester.fallAndSpring;
          }
          else if(semesters.includes("Fall")){
            course.semester = Semester.fall;
          }
          else{
            course.semester = Semester.spring;
          }
          course.graduatePreq = prereq.trim();
          // this.courseService.getCourses().subscribe(s => {
          //   var arr: any = []
          //   s.forEach(element => {
          //     if(element.course == course.course){
                
          //     }  
          //   });
          //   this.s = arr;
          // });
          let name = major+courseID+currentSemester+currentYear
          this.afs.firestore.collection('CourseInfo').doc(name).set(course).then(() => {
            console.log("Added " + course + " to database");
          }).catch((error) => {
            console.log("Problem adding " + course + " to database");
          });
          
          // if(major + courseID == "ESE800"){
            
          //   alert("Added all courses to database");
          //   break;
          // }
        }
        // Get new course
        let vals = line.split(/:/);
        arr = vals[0].split(/\s/)
        major = arr[0]
        courseID = arr[1]
        courseName = vals[1];
        if(vals.length > 1){
          courseName += vals[2]
        }
        console.log(courseName);
        description = ""
        prereq = ""
        credits = ""
        arr = []
        semesters = ""
     
      }
      else{
        if(prereqRegex.test(line)){
          arr = line.split(/:/);
          prereq = arr[1];
          // prereq.replace(/\r?\n/, '')
        }
        else if(fallRegex.test(line) || springRegex.test(line)){
          arr = line.split(/,/)
          if(fallRegex.test(line) && springRegex.test(line)){
            semesters = "Fall/Spring"
          }
          else{
            semesters = arr[0]
          }
          if(arr.length > 1){
            arr = arr[1].split(/\s/)
            credits = arr[0]
          }
        }
        else if(creditRegix.test(line)){
          arr = line.split(/,/)
          arr = arr[0].split(/\s/)
          credits = arr[0]
        }
        description += line + " "
      }
    }
    alert("Added all courses to database");
    // location.reload();
  }

  async uploadStudentData(event) {
    var warningsStringArray = [];
    let fileList: FileList = event.target.files;
    if(fileList.length != 2) {
      alert("Importing student data requires two files: one for student information and one for course plans.");
      return;
    }
    let courseDataHeader = "sbu_id,department,course_num,section,semester,year,grade";
    let studentDataHeader = "sbu_id,first_name,last_name,email,department,track,entry_semester,entry_year,requirement_version_semester,requirement_version_year,graduation_semester,graduation_year,password";

    let text1 = (await fileList.item(0).text()).split(/\r?\n/); // sbu_id,first_name,last_name,email,department,track,entry_semester,entry_year,requirement_version_semester,requirement_version_year,graduation_semester,graduation_year,password
    let text2 =  (await fileList.item(1).text()).split(/\r?\n/); // sbu_id,department,course_num,section,semester,year,grade1
    
    var course_data = 0;
    var student_data = 0;

    if(text1[0] == courseDataHeader) {
      course_data++;
    } else if(text1[0] == studentDataHeader) {
      student_data++;
    } 

    if(text2[0] == courseDataHeader) {
      course_data++;
    } else if(text2[0] == studentDataHeader) {
      student_data++;
    }

    if(course_data > 1 || student_data > 1) {
      alert("Both files are of the same type.")
      return;
    } else if (course_data < 1 || student_data < 1) {
      alert("One or more files were not of the right format");
      return;
    }

    if (text1[0] == courseDataHeader) {
      var temp = text1;
      text1 = text2;
      text2 = temp;
    }

    var notInTheGPDDepartment = [];
    var coursePlanDict = [];

    var studentIDs = [];
    // Parse Student Information
    for (var i = 0; i < text1.length; i++) {
      var strArray = text1[i].split(",");
      if (text1[i] == studentDataHeader) {
        continue;
      } else if (text1[i] == "") {
        continue;
      } else {
        if (strArray.length != 13) {
          if (strArray.length < 13) {
            warningsStringArray.push("A line of your student data file has an insufficient number of fields. This line has been skipped.");
            continue;
          } else {
            let open_quotes = -1;
            let close_quotes = -1;
            for (var j = 0; j < strArray.length; j++) {
              if (strArray[j].startsWith("\"")) {
                open_quotes = j;
              }
              if (strArray[j].endsWith("\"")) {
                close_quotes = j;
              }
            }
            if (open_quotes !== -1 && close_quotes !== -1) {
              var subset = strArray.slice(open_quotes, close_quotes + 1)
              var str = subset.join(",")
              str = str.substring(1, str.length - 1);
              strArray[open_quotes] = str
              strArray.splice(open_quotes + 1, close_quotes - open_quotes)
              open_quotes = -1
              close_quotes = -1
            }
          }
        }
      }

      for (j = 0; j < 13; j++) {
        strArray[j] = strArray[j].trim();
      }

      if (notInTheGPDDepartment.includes(strArray[0])) {
        continue;
      }

      if (studentIDs.includes(strArray[0])) {
        warningsStringArray.push("A duplicate ID " + strArray[0].toString() + " has appeared in the list. This line is ignored. All entries after the first for the ID are ignored.");
        continue;
      }

      // Verify Department and Capitalization
      if (strArray[4].toLocaleLowerCase() !== this.gpd.toLocaleLowerCase()) {
        warningsStringArray.push("Check that student ID " + strArray[0].toString() + " belongs to your department. This student is ignored.");
        continue;
      }
      strArray[4] = strArray[4].toLocaleUpperCase();

      // Edit Track
      var track = strArray[5].toLocaleLowerCase();
      if (strArray[4].toLocaleLowerCase() === 'ams') {
        if (track === "qf" || track === "quantitative finance") {
          strArray[5] = "QF";
        } else if (track === "stat" || track === "statistics") {
          strArray[5] = "STAT";
        } else if (track === "cam" || track === "computational applied mathematics") {
          strArray[5] = "CAM";
        } else if (track === "cb" || track === "computational biology") {
          strArray[5] = "CB";
        } else if (track === "or" || track === "operations research") {
          strArray[5] = "OR";
        } else {
          warningsStringArray.push("Check that AMS student ID " + strArray[0].toString() + " has a valid track. This student's information was not updated.");
          continue;
        }
      } else if (strArray[4].toLocaleLowerCase() === 'bmi') {
        if (track.includes("clinical") && track.includes("thesis")) {
          strArray[5] = "Clinical, Thesis";
        } else if (track.includes("clinical") && track.includes("project")) {
          strArray[5] = "Clinical, Project";
        } else if (track.includes("translational") && track.includes("thesis")) {
          strArray[5] = "Translational, Thesis";
        } else if (track.includes("translational") && track.includes("project")) {
          strArray[5] = "Translational, Project"
        } else if (track.includes("imaging") && track.includes("thesis")) {
          strArray[5] = "Imaging, Thesis";
        } else if (track.includes("imaging") && track.includes("project")) {
          strArray[5] = "Imaging, Project";
        } else {
          warningsStringArray.push("Check that BMI student ID " + strArray[0].toString() + " has a valid track. This student's information was not updated.");
          continue;
        }
      } else if (strArray[4].toLocaleLowerCase() === 'cse') {
        if (track === "advanced project") {
          strArray[5] = "Advanced Project";
        } else if (track === "special project") {
          strArray[5] = "Special Project";
        } else if (track === "thesis") {
          strArray[5] = "Thesis";
        } else {
          warningsStringArray.push("Check that CSE student ID " + strArray[0].toString() + " has a valid track. This student's information was not updated.");
          continue;
        }
      } else if (strArray[4].toLocaleLowerCase() === 'ece') {
        if (track === "thesis") {
          strArray[5] = "Thesis";
        } else if (track === "nonthesis" || track === "non-thesis") {
          strArray[5] = "Non-Thesis";
        } else {
          warningsStringArray.push("Check that ECE student ID " + strArray[0].toString() + " has a valid track. This student's information was not updated.");
          continue;
        }
      } else {
        warningsStringArray.push("Check that student ID " + strArray[0].toString() + " belongs to your department. This student is ignored.");
        continue;
      }
      var value = (2021 - parseInt(strArray[7])) * 2;
      if (strArray[6].toLocaleLowerCase() === "spring") {
        value = value + 1;
      }
      var pass: "";
      var st: Student = {first : strArray[1], last : strArray[2], id : strArray[0], sbuID: strArray[0], email : strArray[3], dept : strArray[4], track : strArray[5], entrySemester : strArray[6], entryYear : strArray[7], reqVersionSemester : strArray[8], reqVersionYear : strArray[9], gradSemester : strArray[10], gradYear : strArray[11], advisor : "", comments : [], satisfied : 0, unsatisfied : 0, pending : 0, graduated : false, validCoursePlan : true, semesters : value};
      this.hashPassword(strArray[12]).then((hash) => {
        st.password = hash.toString()
        this.afs.firestore.collection('Students').doc(st.id).set(st)
        studentIDs.push(strArray[0])});
    }

    // Parse Course Plan Information
    for (var i = 0; i < text2.length; i++) {
      if (text2[i] == courseDataHeader) {
        continue;
      } else if (text2[i] == "") {
        continue;
      } else {
        var strArray = text2[i].split(",");
        if (strArray.length != 7) {
          warningsStringArray.push("A line of your student data file has an insufficient number of fields. Please verify your files and try again. This line will be ignored.")
          continue;
        }
        for (var j = 0; j < 7; j++) {
          strArray[j] = strArray[j].trim();
        }
        let dictionary_identifier = strArray[0].trim() + strArray[1].trim() + strArray[2].trim() + strArray[4].trim() + strArray[5].trim();
        if (coursePlanDict.includes(dictionary_identifier) === true) {
          alert("WARNING:\nA duplicate entry exists in the course plan file (same student, same course, and same semester). Please verify your file and try again. All duplicate lines after the first will be ignored.");
          continue;
        }
        if (isNaN(Number(strArray[2])) == true) {
          warningsStringArray.push("Course number must be a numerical value only. The line containing student ID " + strArray[0] + " and course " + strArray[1].toLocaleUpperCase() + " " + strArray[2] + " has been skipped.");
          continue;
        }
        if (strArray[2].includes(".") == true) {
          warningsStringArray.push("Course number must be an integer value only. The line containing student ID " + strArray[0] + " and course " + strArray[1].toLocaleUpperCase() + " " + strArray[2] + " has been skipped.");
          continue;
        }
        if (parseInt(strArray[2]) < 0) {
          warningsStringArray.push("Course number must be a positive value only. The line containing student ID " + strArray[0] + " and course " + strArray[1].toLocaleUpperCase() + " " + strArray[2] + " has been skipped.");
          continue;
        }
        if (isNaN(Number(strArray[3])) == true) {
          warningsStringArray.push("Course section must be a numerical value only. The line containing student ID " + strArray[0] + " and course " + strArray[1].toLocaleUpperCase() + " " + strArray[2] + " has been skipped.");
          continue;
        }
        if (strArray[3].includes(".") == true) {
          warningsStringArray.push("Course section must be an integer value only. The line containing student ID " + strArray[0] + " and course " + strArray[1].toLocaleUpperCase() + " " + strArray[2] + " has been skipped.");
          continue;
        }
        if (parseInt(strArray[3]) < 0) {
          warningsStringArray.push("Course section must be a positive value only. The line containing student ID " + strArray[0] + " and course " + strArray[1].toLocaleUpperCase() + " " + strArray[2] + " has been skipped.");
          continue;
        }
        if (isNaN(Number(strArray[5])) == true) {
          warningsStringArray.push("Year values must be a numerical value only. The line containing student ID " + strArray[0] + " and course " + strArray[1].toLocaleUpperCase() + " " + strArray[2] + " has been skipped.");
          continue;
        }
        if (strArray[5].includes(".") == true) {
          warningsStringArray.push("Year values must be an integer value only. The line containing student ID " + strArray[0] + " and course " + strArray[1].toLocaleUpperCase() + " " + strArray[2] + " has been skipped.");
          continue;
        }
        if (parseInt(strArray[5]) < 0) {
          warningsStringArray.push("Year values must be a positive value only. The line containing student ID " + strArray[0] + " and course " + strArray[1].toLocaleUpperCase() + " " + strArray[2] + " has been skipped.");
          continue;
        }
        var grades: string[] = Object.values(Grade);
        if (grades.includes(strArray[6].trim().toLocaleUpperCase()) == false) {
          warningsStringArray.push("Grade is not correct. The line containing student ID " + strArray[0] + " and course " + strArray[1].toLocaleUpperCase() + " " + strArray[2] + " has been skipped.");
          continue;
        }
        let studentID = strArray[0].trim();
        let department = strArray[1].trim();
        let courseID = strArray[2].trim();
        let section = strArray[3].trim();
        if (section == "") {
          section = "??";
        }
        let semester = strArray[4].trim();
        let year = strArray[5].trim();
        let grade = strArray[6].trim();
        let semesterAndYear = semester + year;
        let course = department + courseID;
        let courseIdentifier = course + "_" + section;
        this.afs.collection('Students').doc(studentID).update({
          ['coursePlan' + '.' + semesterAndYear + '.' + courseIdentifier] : `${grade.toLocaleUpperCase()}`
        }).then(() => {
    
        }).catch((error) => {
          console.log("Student ID: " + studentID + " does not exist.");
        });
        coursePlanDict.push(dictionary_identifier);
      }
    }

    if (warningsStringArray.length == 0) {
      alert("Student information and course plan grades have been updated successfully.");
    } else {
      var warning_string = "";
      for (i = 0; i < warningsStringArray.length; i++) {
        warning_string = warning_string + warningsStringArray[i] + "\n";
      }
      alert("Valid student information and course plan grades have been updated successfully. The following warning(s) were found:\n\n" + warning_string);
    }
  }

  async uploadGrade(event) {
    let fileList: FileList = event.target.files;
    if(fileList.length != 1) {
      alert("Importing student grades requires one file only.");
      return;
    }
    let courseDataHeader = "sbu_id,department,course_num,section,semester,year,grade";
    var g = (await fileList.item(0).text()).split(/\r?\n/); // sbu_id,department,course_num,section,semester,year,grade1
    
    if (g[0] != courseDataHeader) {
      alert("Grades file does not match format.");
      return;
    } 
    var coursePlanDict = [];
    var warningsStringArray = [];

    for (var i = 0; i < g.length; i++) {
      if (g[i] == courseDataHeader) {
        continue;
      } else if (g[i] == "") {
        continue;
      } else {
        var strArray = g[i].split(",");
        if (strArray.length != 7) {
          warningsStringArray.push("A line of your student data file has an insufficient number of fields. Please verify your files and try again. This line will be ignored.")
          continue;
        }
        for (var j = 0; j < 7; j++) {
          strArray[j] = strArray[j].trim();
        }
        let dictionary_identifier = strArray[0].trim() + strArray[1].trim() + strArray[2].trim() + strArray[4].trim() + strArray[5].trim();
        if (coursePlanDict.includes(dictionary_identifier) === true) {
          alert("WARNING:\nA duplicate entry exists in the course plan file (same student, same course, and same semester). Please verify your file and try again. All duplicate lines after the first will be ignored.");
          continue;
        }
        if (isNaN(Number(strArray[2])) == true) {
          warningsStringArray.push("Course number must be a numerical value only. The line containing student ID " + strArray[0] + " and course " + strArray[1].toLocaleUpperCase() + " " + strArray[2] + " has been skipped.");
          continue;
        }
        if (strArray[2].includes(".") == true) {
          warningsStringArray.push("Course number must be an integer value only. The line containing student ID " + strArray[0] + " and course " + strArray[1].toLocaleUpperCase() + " " + strArray[2] + " has been skipped.");
          continue;
        }
        if (parseInt(strArray[2]) < 0) {
          warningsStringArray.push("Course number must be a positive value only. The line containing student ID " + strArray[0] + " and course " + strArray[1].toLocaleUpperCase() + " " + strArray[2] + " has been skipped.");
          continue;
        }
        if (isNaN(Number(strArray[3])) == true) {
          warningsStringArray.push("Course section must be a numerical value only. The line containing student ID " + strArray[0] + " and course " + strArray[1].toLocaleUpperCase() + " " + strArray[2] + " has been skipped.");
          continue;
        }
        if (strArray[3].includes(".") == true) {
          warningsStringArray.push("Course section must be an integer value only. The line containing student ID " + strArray[0] + " and course " + strArray[1].toLocaleUpperCase() + " " + strArray[2] + " has been skipped.");
          continue;
        }
        if (parseInt(strArray[3]) < 0) {
          warningsStringArray.push("Course section must be a positive value only. The line containing student ID " + strArray[0] + " and course " + strArray[1].toLocaleUpperCase() + " " + strArray[2] + " has been skipped.");
          continue;
        }
        if (isNaN(Number(strArray[5])) == true) {
          warningsStringArray.push("Year values must be a numerical value only. The line containing student ID " + strArray[0] + " and course " + strArray[1].toLocaleUpperCase() + " " + strArray[2] + " has been skipped.");
          continue;
        }
        if (strArray[5].includes(".") == true) {
          warningsStringArray.push("Year values must be an integer value only. The line containing student ID " + strArray[0] + " and course " + strArray[1].toLocaleUpperCase() + " " + strArray[2] + " has been skipped.");
          continue;
        }
        if (parseInt(strArray[5]) < 0) {
          warningsStringArray.push("Year values must be a positive value only. The line containing student ID " + strArray[0] + " and course " + strArray[1].toLocaleUpperCase() + " " + strArray[2] + " has been skipped.");
          continue;
        }
        var grades: string[] = Object.values(Grade);
        if (grades.includes(strArray[6].trim().toLocaleUpperCase()) == false) {
          warningsStringArray.push("Grade is not correct. The line containing student ID " + strArray[0] + " and course " + strArray[1].toLocaleUpperCase() + " " + strArray[2] + " has been skipped.");
          continue;
        }
        let studentID = strArray[0].trim();
        let department = strArray[1].trim();
        let courseID = strArray[2].trim();
        let section = strArray[3].trim();
        if (section == "") {
          section = "??";
        }
        let semester = strArray[4].trim();
        let year = strArray[5].trim();
        let grade = strArray[6].trim();
        let semesterAndYear = semester + year;
        let course = department + courseID;
        let courseIdentifier = course + "_" + section;
        var student: Student;
        this.afs.collection('Students').doc(studentID).valueChanges().subscribe(val => {
        student= val;
        console.log(student.dept)
        console.log(this.gpd)
        if(student.dept == this.gpd){
          this.afs.collection('Students').doc(studentID).update({
            ['coursePlan' + '.' + semesterAndYear + '.' + courseIdentifier] : `${grade.toLocaleUpperCase()}`
          }).then(() => {
      
          }).catch((error) => {
            console.log("Student ID: " + studentID + " does not exist.");
          });
        }
        else{
          console.log("Not correct GPD")
        }
        });
      
        coursePlanDict.push(dictionary_identifier);
      }
    }

    if (warningsStringArray.length == 0) {
      alert("Student information and course plan grades have been updated successfully.");
    } else {
      var warning_string = "";
      for (i = 0; i < warningsStringArray.length; i++) {
        warning_string = warning_string + warningsStringArray[i] + "\n";
      }
      alert("Valid student information and course plan grades have been updated successfully. The following warning(s) were found:\n\n" + warning_string);
    }
  }

  async hashPassword (password) {
    const hash = await new Promise((resolve, reject) => {
      bcrypt.hash(password, 10, function(err, hash) {
        if (err) {
          reject(err)
        } else {
          resolve(hash)
        }
      });
    })
    return hash;
  }

  async uploadDegreeReqs(event) {
  
  }

  async uploadCourse(event) {
    let fileList: FileList = event.target.files;
    let courseDataHeader = "department,course_num,section,semester,year,timeslot";
    let text = (await fileList.item(0).text()).split(/\r?\n/);
    if (text[0] != courseDataHeader) {
      alert("Course offerings file does not match proper format.");
      return;
    } 
    for(var i = 0; i < text.length; i++){
      if (text[i] == courseDataHeader) {
        continue;
      } else if (text[i] == "") {
        continue;
      } else {
        var strArray = text[i].split(",")
        var id = strArray[0] + strArray[1]
        var course = id;
        console.log(strArray);
        var courseID = strArray[1];
        var section = strArray[2];
        var semester = strArray[3];
        var year = strArray[4];
        var timeSlot = strArray[5];
        var timeArray = timeSlot.split(" ");
        var days = timeArray[0];
        var times = timeArray[1].split("-");
        var startTime = times[0];
        var endTime = times[1];
        var id = id + section + semester + year;
        id = id.replace(/\s+/g, '');
        console.log(id);
        this.afs.collection("Courses").doc(id).set({
        course: course,
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
    alert("Course offerings have been succesfully updated.");
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

