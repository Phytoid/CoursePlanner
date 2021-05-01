import { SemesterDialogComponent } from './../semester-dialog/semester-dialog.component';
import { ECE } from './../../models/ece';
import { CSE } from './../../models/cse';
import { BMI } from './../../models/bmi';
import { AMS } from './../../models/ams';
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
import { MatDialog } from '@angular/material/dialog';
import { StudentRequirementsService } from 'src/app/services/student-requirements.service';


export interface SemesterDialogData {
  semester: string;
  year: Number;
  departments: string;
  
}

@Component({
  selector: 'app-gpd',
  templateUrl: './gpd.component.html',
  styleUrls: ['./gpd.component.css']
})

export class GpdComponent implements OnInit {
  s: Student[];
  gpd: String;
  semester: String;
  year: Number;
  departments: String[];
  map = new Map([
    ["A", 4],
    ["A-", 3.7],
    ["B+", 3.3],
    ["B", 3],
    ["B-", 2.7],
    ["C+", 2.3],
    ["C", 2.0],
    ["C-", 1.7],
    ["D+", 1.3],
    ["D", 1.0],
    ["D-", 0.7],
    ["F", 0],
  ]);

  constructor(private authService: AuthService, public router: Router, public studentService: StudentService, public afs: AngularFirestore, public courseService: CourseService, public dialog: MatDialog, public sr: StudentRequirementsService) {
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

  // Functions called prior to importing a specific file and alerts user of the file format
  alertForUploadStudent(event){
    alert("Uploading student data requires two CSV files.");
    event.click()
  }
  alertForUploadGrade(event){
    alert("File must be a CSV file.");
    event.click()
  }
  alertForUploadCourses(event){
    alert("File must be a CSV file.");
    event.click()
  }
  alertForUploadDegrees(event){
    alert("File must be a JSON file.");
    event.click()
  }


  openDialog(event): void {
    const dialogRef = this.dialog.open(SemesterDialogComponent, {
      width: '250px',
      data: {semester: this.semester, year: this.year}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.semester = result.semester;
      this.year = result.year;
      var string = result.departments;
      this.departments = string.split(/\s/);
      console.log(this.departments);
      alert("Convert PDF file of course descriptions to docx file. Then convert docx file to a text file.")
      event.click();
    });
  }
  
  async scrapeCourseInfo(event){
    // Gets file from user
    let fileList: FileList = event.target.files;

    // User does not upload file, return
    if(fileList.length != 1) {
      alert("Scraping course info requires one text file.");
      return;
    }

    //Removes all lines that start with "Stony" from text file 
    let text2 = (await fileList.item(0).text()).replace(/^Stony.*$/gm, '')
    //Removes all lines that start with "GRADUATE" from text file 
    text2 = text2.replace(/^GRADUATE.*$/gm, '');
    //Removes all lines that start with "Offered" from text file 
    text2 = text2.replace(/^Offered.*$/gm, '');
    // Removes all lines that start with 3 letters followed by new line
    text2 = text2.replace(/^([A-Z][A-Z][A-Z]\r?\n)/g, '');
    // Replaces all lines with only course number
    text2 = text2.replace(/^([A-Z][A-Z][A-Z]\s[0-9][0-9][0-9]\s)/gm, '')
    //Removes new line characters followed by a space from text file 
    text2 = text2.replace(/\r?\n\s/g, '');
    //Removes all double spaces
    text2 = text2.replace(/\s\s/g, ' ');
    // Standardized lines that start with Prerequisite
    text2 = text2.replace(/^Prerequisite /gm, 'Prerequisite:')
    // Split text by new line character into string array
    let text1 = text2.split(/\r?\n/);

    // Declared variables to be used when parsing text
    let course:Courses;
    let courseID = null;
    let major = "";
    let courseName = "";
    let description = "";
    let prereq = "";
    let semesters = "";
    let credits = "";

    // Regex pattern to check for a start of a new course's information
    const courseRegex = /^([A-Z][A-Z][A-Z]\s[0-9][0-9][0-9]:)/;
    // Regex pattern to check for a course's prqrequiste
    const prereqRegex = /^Prerequisite/;
    // Regex patterns to check for semester of course
    const fallRegex = /^Fall/;
    const springRegex = /^Spring/;
    // regex pattern to get number of credits a course provides
    const creditRegix = /^[0-9]/;
    let arr = []

    // Iterate through all lines of text file and add course to database
    for(const line of text1){

      // Checks for start of new course information
      if(courseRegex.test(line)){

        // Adds current course to database
        if(courseID != null && this.departments.includes(major)){
          
          course = {courseID: courseID, courseName: courseName, description: description};

          // Sets a courses value with values from the text
          course.courseID = courseID;
          course.courseName = courseName.trim();
          course.courseName = course.courseName.replace(/undefined/, '')
          course.description = description;
          course.course = major + courseID;
          course.department = major;
          course.year = this.year;
          // sets credits to 3 if no credit amount was specified
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
          // Sets a course's semester information to either fall, spring or both
          if(semesters.includes("Fall") && semesters.includes("Spring")){
            course.semester = Semester.fallAndSpring;
          }
          else if(semesters.includes("Fall")){
            course.semester = Semester.fall;
          }
          else{
            course.semester = Semester.spring;
          }

          // Store course's prereqs
          course.graduatePreq = prereq.trim();
          let name = major + courseID + this.semester + this.year;

          // Add course to database
          this.afs.firestore.collection('CourseInfo').doc(name).set(course).then(() => {
            console.log("Added " + course + " to database");
          }).catch((error) => {
            console.log("Problem adding " + course + " to database");
          });
        }

        // Parses new course's information
        let vals = line.split(/:/);
        arr = vals[0].split(/\s/)
        major = arr[0]
        courseID = arr[1]
        courseName = vals[1];
        if(vals.length > 1){
          courseName += vals[2]
        }
        description = ""
        prereq = ""
        credits = ""
        arr = []
        semesters = ""
     
      }

      // Description, prereqs, and credit info for a course is parsed 
      else{
        // Parse for preqs
        if(prereqRegex.test(line)){
          arr = line.split(/:/);
          prereq = arr[1];
        }

        // Parse for semester
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
        // Parse for credits
        else if(creditRegix.test(line)){
          arr = line.split(/,/)
          arr = arr[0].split(/\s/)
          credits = arr[0]
        }
        // Add to course's description
        description += line + " "
      }
    }
    // alert("Added all courses to database");
  }

  // async uploadStudentData(event) {
    
  async uploadStudentData(event, callback) {
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
      var docRef = this.afs.collection("Degrees").doc(strArray[4] + strArray[8] + strArray[9]);
      var st: Student ;
      if(strArray[4] == 'AMS'){
        st= {first : strArray[1], last : strArray[2], id : strArray[0], sbuID: strArray[0], email : strArray[3], dept : strArray[4], track : strArray[5], entrySemester : strArray[6], entryYear : strArray[7], reqVersionSemester : strArray[8], reqVersionYear : strArray[9], gradSemester : strArray[10], gradYear : strArray[11], advisor : "", comments : [], satisfied : 1, unsatisfied : 3, pending : 0, graduated : false, validCoursePlan : true, semesters : value, gpa: 0, credits: 0, requiredCourses : [], hasThesis: false,meetsGPA: false, meetsCreditMinimum: false, electiveCredits: 0, isMeetTimeLimit: false, meetsElectiveCreditMinimum: false,numAmsStatCourses: 0, hasAmsFinalRec: false, hasAmsORStatComplete: false};
      }
      else if(strArray[4] == 'BMI'){
        st= {first : strArray[1], last : strArray[2], id : strArray[0], sbuID: strArray[0], email : strArray[3], dept : strArray[4], track : strArray[5], entrySemester : strArray[6], entryYear : strArray[7], reqVersionSemester : strArray[8], reqVersionYear : strArray[9], gradSemester : strArray[10], gradYear : strArray[11], advisor : "", comments : [], satisfied : 1, unsatisfied : 3, pending : 0, graduated : false, validCoursePlan : true, semesters : value, gpa: 0, credits: 0, requiredCourses : [], hasThesis: false, meetsGPA: false, meetsCreditMinimum: false, electiveCredits: 0, isMeetTimeLimit: false, meetsElectiveCreditMinimum: false, hasBMI592AllSemesters: false};
      }
      else if(strArray[4] == 'CSE'){
        st= {first : strArray[1], last : strArray[2], id : strArray[0], sbuID: strArray[0], email : strArray[3], dept : strArray[4], track : strArray[5], entrySemester : strArray[6], entryYear : strArray[7], reqVersionSemester : strArray[8], reqVersionYear : strArray[9], gradSemester : strArray[10], gradYear : strArray[11], advisor : "", comments : [], satisfied : 1, unsatisfied : 5, pending : 0, graduated : false, validCoursePlan : true, semesters : value, gpa: 0, credits: 0, requiredCourses : [], hasThesis: false, meetsCreditMinimum: false, electiveCredits: 0, isMeetTimeLimit: false, meetsGPA: false, meetsElectiveCreditMinimum: false, numCseBasicCourses: 0, hasCseBasicCourses: false, hasCseTheoryCourse: false, hasCseIISCourse: false, hasCseSystemsCourse: false };
      }
      else{
        st= {first : strArray[1], last : strArray[2], id : strArray[0], sbuID: strArray[0], email : strArray[3], dept : strArray[4], track : strArray[5], entrySemester : strArray[6], entryYear : strArray[7], reqVersionSemester : strArray[8], reqVersionYear : strArray[9], gradSemester : strArray[10], gradYear : strArray[11], advisor : "", comments : [], satisfied : 1, unsatisfied : 7, pending : 0, graduated : false, validCoursePlan : true, semesters : value, gpa: 0, credits: 0, requiredCourses : [], hasThesis: false, meetsCreditMinimum: false, electiveCredits: 0, isMeetTimeLimit: false, meetsElectiveCreditMinimum: false, numEceCadCourse: 0, numEceHardwareCourse: 0, numEceTheoryCourse: 0, numEceNetworkCourse: 0, numEceRegularCredits: 0, numEse599Credits: 0, numEse697Credits: 0, hasEce599Credits: false, meetsGPA: false, hasEce697Credits: false, hasEceCadCourse: false, hasEceHardwareCourse: false, hasEceNetworkingCourse: false, hasEceRegularCredits:false, hasEceTheoryCourse: false};
      }
      
      
      this.hashPassword(strArray[12]).then((hash) => {
        st.password = hash.toString()
        this.afs.firestore.collection('Students').doc(st.id).set(st).then(
          
        )
        studentIDs.push(strArray[0])
      }); 
      docRef.valueChanges().subscribe(async val => {
          await this.sr.setStudentRequirements(st, val);
          callback(text2, this.afs, this.editGPA, this.addToDatabase, this.updateStudent);
      });
      
    }
    // callback(text2, this.afs);
  }

  // async fun(docRef, sr, st, val){
  //   return new Promise(resolve => {docRef.valueChanges().subscribe(val => {
  //     this.sr.setStudentRequirements(st, val);
  //  });
  // }

  async uploadGrade(event) {
    let fileList: FileList = event.target.files;
    if(fileList.length != 1) {
      alert("Importing student grades requires one file only.");
      return;
    }
    var g = (await fileList.item(0).text()).split(/\r?\n/); // sbu_id,department,course_num,section,semester,year,grade1
    this.uploadCoursePlan(g, this.afs, this.editGPA, this.addToDatabase, this.updateStudent);
  }

  async uploadCoursePlan(g, afs, editGPA, addToDatabase, updateStudent) {
    let courseDataHeader = "sbu_id,department,course_num,section,semester,year,grade";
    var coursePlanDict = [];
    if (g[0] != courseDataHeader) {
      alert("Grades file does not match format.");
      return;
    } 
    var coursePlanDict = [];
    var warningsStringArray = [];
    var studentArray : Map<string, Map<string, string>> = new Map();
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
        if(studentArray.get(studentID) !== undefined ){
          studentArray.get(studentID).set(course+semesterAndYear, grade);
        }
        else{
          var map: Map<string, string> = new Map();
          studentArray.set(studentID, map);
          studentArray.get(studentID).set(course+semesterAndYear, grade);
        }
        // this.editGPA(studentID, course, semesterAndYear, grade);
        afs.collection('Students').doc(studentID).ref.get().then(val => {
          student = val.data();

          if(student.dept == localStorage.getItem('gpdType')){ 
            afs.collection('Students').doc(studentID).update({
              ['coursePlan' + '.' + semesterAndYear + '.' + courseIdentifier] : `${grade.toLocaleUpperCase()}`
            }).then(() => {
      
            }).catch((error) => {
              console.log("Student ID: " + studentID + " does not exist.");
            });
          } else {
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
      for (var i = 0; i < warningsStringArray.length; i++) {
        warning_string = warning_string + warningsStringArray[i] + "\n";
      }
      alert("Valid student information and course plan grades have been updated successfully. The following warning(s) were found:\n\n" + warning_string);
    }
    
    editGPA(studentArray, afs, addToDatabase, updateStudent);
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
    let fileList: FileList = event.target.files;
    if(fileList.length != 1) {
      alert("Importing student data requires one file");
      return;
    }
    // Gets text from file
    let text = (await fileList.item(0).text());
    // Converts to JSON formatting
    var myObj = JSON.parse(text);
    // Check if degree requirement for AMS
    if(myObj.department === "AMS"){
      var amsDegree: AMS = {
      department : myObj.department,
      versionSemester: myObj.versionSemester,
      versionYear : myObj.versionYear,
      track : myObj.track,
      timeLimit : myObj.timeLimit,
      requiredCoursesCAM : myObj.requiredCoursesCAM,
      requiredCoursesCB : myObj.requiredCoursesCB,
      numElectiveCoursesCB : myObj.numElectiveCoursesCB,
      requiredCoursesOR : myObj.requiredCoursesOR,
      statisticCoursesOR : myObj.statisticCoursesOR,
      numStatisticCoursesOR : myObj.numStatisticCoursesOR,
      electiveCoursesOR : myObj.electiveCoursesOR,
      electiveCoursesSubsOR : myObj.electiveCoursesSubsOR,
      numElectiveCoursesSubStatsOR : myObj.numElectiveCoursesSubStatsOR,
      numElectiveCoursesSubFinance : myObj.numElectiveCoursesSubFinance,
      requiredCoursesSTAT : myObj.requiredCoursesSTAT,
      numElectiveCoursesSTAT : myObj.numElectiveCoursesSTAT,
      requiredCoursesQF : myObj.requiredCoursesQF,
      numElectiveCoursesQF : myObj.numElectiveCoursesQF,
      credits : myObj.credits,
      gpa : myObj.gpa,
      courseGrades : myObj.courseGrades,
      finalRec : myObj.finalRec}
      this.afs.collection("Degrees").doc("AMS"+amsDegree.versionSemester+amsDegree.versionYear).set(amsDegree).then(()=>{
        console.log("AMS Degree Updated")
      })
    }

    // Check if degree requirement for BMI
    else if(myObj.department === "BMI"){
      var bmiDegree: BMI = {
      department : myObj.department,
      versionSemester : myObj.versionSemester,
      versionYear : myObj.versionYear,
      track : myObj.track,
      requiredCourses : myObj.requiredCourses,
      credits : myObj.credits,
      numCreditsNotFromNonElectives : myObj.numCreditsNotFromNonElectives,
      nonElectives : myObj.nonElectives,
      requiredCoursesII : myObj.requiredCoursesII,
      electivesII : myObj.electivesII,
      requriedCoursesCI : myObj.requiredCoursesCI,
      electivesCI : myObj.electivesCI,
      requiredCoursesTBI : myObj.requiredCoursesTBI,
      electiveCoursesTBI : myObj.electiveCoursesTBI,
      requiredCourseProject : myObj.requiredCourseProject,
      requiredCourseThesis : myObj.requiredCourseThesis,
      maxBMI596CreditsProject : myObj.maxBMI596CreditsProject,
      maxBMI599CreditsThesis : myObj.maxBMI599CreditsThesis,
      maxBMI596CreditsThesis : myObj.maxBMI596CreditsThesis,
      maxBMI598CreditsProject : myObj.maxBMI598CreditsProject,
      maxTransferCredits : myObj.maxTransferCredits,
      maxTransferFromOther : myObj.maxTransferFromOther,
      timeLimit : myObj.timeLimit,
      creditMinimumPerSemester : myObj.creditMinimumPerSemester,
      BMI592AllSemesters : myObj.BMI592AllSemesters,
      registration : myObj.registration,
      gpa : myObj.gpa }
      this.afs.collection("Degrees").doc("BMI"+bmiDegree.versionSemester+bmiDegree.versionYear).set(bmiDegree).then(()=>{
        console.log("BMI Degree Updated")
      })
    }
    // Check if degree requirement for CSE
    else if(myObj.department === "CSE"){
      var cseDegree: CSE = {
      department : myObj.department,
      versionSemester : myObj.versionSemester,
      versionYear : myObj.versionYear,
      track : myObj.track,
      minCredits : myObj.minCredits,
      maxCreditsCSE587 : myObj.maxCreditsCSE587,
      oneGraduateClass : myObj.oneGraduateClass,
      gpa : myObj.gpa,
      minCreditEverythingS: myObj.minCreditEverythingS,
      requiredCoursesA : myObj.requiredCoursesA,
      requiredCoursesS : myObj.requiredCoursesS,
      notAllowedCoursesA : myObj.notAllowedCoursesA,
      notAllowedCoursesS : myObj.notAllowedCoursesS,
      minBasicProjectS : myObj.minBasicProjectS,
      basicProjectCourses : myObj.basicProjectCourses,
      everythingCoursesS : myObj.everythingCoursesS,
      maxSpecialCoursesS : myObj.maxSpecialCoursesS,
      maxSpecialCreditsS : myObj.maxSpecialCreditsS,
      requiredCoursesT : myObj.requiredCoursesT,
      maxCreditsCSE599 : myObj.maxCreditsCSE599,
      thesis : myObj.thesis,
      theoryCourses: myObj.theoryCourses,
      systemsCourses: myObj.systemsCourses,
      iisCourses: myObj.iisCourses }
      console.log(cseDegree.iisCourses);
      this.afs.collection("Degrees").doc("CSE"+cseDegree.versionSemester+cseDegree.versionYear).set(cseDegree).then(()=>{
        console.log("CSE Degree Updated")
      })
    }
    // Check if degree requirement for ESE
    else{
      var eceDegree: ECE = {
      department : myObj.department,
      versionSemester : myObj.versionSemester,
      versionYear : myObj.versionYear,
      track : myObj.track,
      hardwareCourses : myObj.hardwareCourses,
      networkingCourses : myObj.networkingCourses,
      cadCourses : myObj.cadCourses,
      theoryCourses : myObj.theoryCourses,
      subAreas1 : myObj.subAreas1,
      subAreas2 : myObj.subAreas2,
      requiredCoursesNT : myObj.requiredCoursesNT,
      nonRegularCourses : myObj.nonRegularCourses,
      numCreditsSubAreas1NT : myObj.numCreditsSubAreas1NT,
      numCreditsSubAreas2NT : myObj.numCreditsSubAreas2NT,
      maxCreditsESE697NT : myObj.maxCreditsESE697NT,
      maxCreditsESE698NT : myObj.maxCreditsESE698NT,
      numRegularCoursesNT :myObj.numRegularCoursesNT,
      maxComboCreditsNT : myObj.maxComboCreditsNT,
      minCreditsESE697NT : myObj.minCreditsESE697NT,
      maxTransferCredits : myObj.maxTransferCredits,
      timeLimit : myObj.timeLimit,
      creditMinimumNT : myObj.creditMinimumNT,
      gpaNT : myObj.gpaNT,
      creditMinimumT : myObj.creditMinimumT,
      gpaT : myObj.gpaT,
      minCreditsESE697T : myObj.minCreditsESE697T,
      maxComboCreditsT : myObj.maxComboCreditsT,
      maxCreditsESE697T : myObj.maxCreditsESE697T,
      maxCreditsESE698T : myObj.maxCreditsESE698T,
      numCreditsSubAreas1T : myObj.numCreditsSubAreas1T,
      numCreditsSubAreas2T : myObj.numCreditsSubAreas2T,
      minCreditsESE599T : myObj.minCreditsESE599T,
      numRegularCoursesT : myObj.numRegularCoursesT,
      completeThesis : myObj.completeThesis }
      this.afs.collection("Degrees").doc("ESE"+eceDegree.versionSemester+eceDegree.versionYear).set(eceDegree).then(()=>{
        console.log("ECE Degree Updated")
      })
    }
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


  async editGPA(map: Map<string, Map<string, string>>, afs, addToDatabase, updateStudent){
    for(var studentID of map.keys()){
        for (var course of map.get(studentID).keys()){
          await addToDatabase(course, studentID, afs, map, updateStudent);
        }
    }
    return;
  }

  addToDatabase(course, studentID, afs, map, updateStudent){
      var gr = map.get(studentID).get(course);
      var grades = new Map([
        ["A", 4],
        ["A-", 3.7],
        ["B+", 3.3],
        ["B", 3],
        ["B-", 2.7],
        ["C+", 2.3],
        ["C", 2.0],
        ["C-", 1.7],
        ["D+", 1.3],
        ["D", 1.0],
        ["D-", 0.7],
        ["F", 0],
      ]);
      var g = grades.get(gr);
      return new Promise(resolve => {
      afs.collection('Students').doc(studentID).ref.get().then((s) => {
          var student: Student = s.data();
          console.log(student);
          afs.collection('CourseInfo').doc(course).valueChanges().subscribe( async val => {

            // calculates GPA and credits
            var c: Courses;
            c = val;
            var credits: number = c.credits.valueOf();
            var currentGrade = student.credits * student.gpa;
            currentGrade += (g * credits);
            var currentCredits = credits + student.credits;
            var gpa = (currentGrade / currentCredits).toPrecision(3);

            
            // Removes course from course requirement if fullfills grade needed
            course = course.substring(0, 6);
            if(g >= 2.0){
              s = await updateStudent(g, course, student, gpa, credits, afs)
            }
            else{
              s.gpa = gpa;
              s.credits = credits;
            }
            
            
            
            afs.collection("Students").doc(studentID).set(s).then(()=>{
              console.log("Student gpa Updated");  
              resolve(gpa);
            })
          });
        });
    })
  }

  async updateStudent(g, course, student, gpa, credits, afs){
    var satisfied = student.satisfied;
    var pending = student.pending;
    var unsatisfied = student.unsatisfied;
    var requiredCourses = student.requiredCourses;
    var changeGPA = false;
    return new Promise(resolve => {

      if(g >= 2.0){
        var i;
        
        // Removes course from course requirement if fullfills grade needed
        var isElective = true;
        
        for(i = 0; i < student.requiredCourses.length; i++){
          if(student.requiredCourses[i].includes(course)){
            requiredCourses.splice(i, 1);
            if(requiredCourses.length == 0){
              satisfied += 1;
              if(pending > 0){
                pending -= 1;
              }
            }
            isElective = false;
            if(student.dept == 'BMI'){
              student.electiveCredits += credits;
            }
            student.credits += credits;
            console.log(student.credits);
            student.satisfied = satisfied;
            student.pending = pending;
            student.unsatisfied = unsatisfied;
            student.gpa = parseFloat(gpa);
            resolve(student);
          }
        }
        var ams: AMS;
        var bmi: BMI;
        var cse: CSE;
        var ece: ECE;
        
        // Check if student satisfies credit min
        if(isElective){
          if(student.dept == 'AMS'){
            afs.collection('Degrees').doc('AMS' + student.entrySemester + student.entryYear).valueChanges().subscribe(amsDoc => {
              ams = amsDoc;
              student.credits += credits;
              if(student.track == 'CB'){
                student.electiveCredits += credits;
                
                changeGPA = true
                if(student.credits >= ams.credits && !student.meetsCreditMinimum){
                  satisfied += 1;
                  if(unsatisfied > 0){
                    unsatisfied -= 1;
                  }
                  else{
                    pending -= 1;
                  }
                  student.meetsCreditMinimum = true;
                }
                if(student.electiveCredits >= ams.numElectiveCoursesCB){
                  satisfied += 1;
                  if(unsatisfied > 0){
                    unsatisfied -= 1;
                  }
                  else{
                    pending -= 1;
                  }
                  student.meetsElectiveCreditMinimum = true;
                }
              }

              else if(student.track == 'OR'){
                if(student.credits >= ams.credits && !student.meetsCreditMinimum){
                  satisfied += 1;
                  if(unsatisfied > 0){
                    unsatisfied -= 1;
                  }
                  else{
                    pending -= 1;
                  }
                  student.meetsCreditMinimum = true;
                }
                if(ams.statisticCoursesOR.includes(course)){
                  student.numAmsStatCourses += 1;
                  student.electiveCredits += credits;
                  changeGPA = true;
                  if(student.numAmsStatCourses >= ams.numStatisticCoursesOR && !student.hasAmsORStatComplete){
                    satisfied += 1;
                    if(unsatisfied > 0){
                      unsatisfied -= 1;
                    }
                    else{
                      pending -= 1;
                    }
                    student.hasAmsORStatComplete = true;
                  }
                }
                
                else if(ams.electiveCoursesSubsOR.includes(course)){
                  student.electiveCredits += credits;
                  changeGPA = true;
                  if(student.electiveCredits >= ams.numElectiveCoursesOR){
                    satisfied += 1;
                    if(unsatisfied > 0){
                      unsatisfied -= 1;
                    }
                    else{
                      pending -= 1;
                    }
                    student.meetsElectiveCreditMinimum = true;
                  }
                }
              }

              else if(student.track == 'CAM'){
                changeGPA = true;
                if(student.credits >= ams.credits && !student.meetsCreditMinimum){
                  satisfied += 1;
                  if(unsatisfied > 0){
                    unsatisfied -= 1;
                  }
                  else{
                    pending -= 1;
                  }
                  student.meetsCreditMinimum = true;
                }
                if(student.electiveCredits >= ams.numElectiveCoursesCAM && !student.meetsElectiveCreditMinimum){
                  satisfied += 1;
                  if(unsatisfied > 0){
                    unsatisfied -= 1;
                  }
                  else{
                    pending -= 1;
                  }
                  student.meetsElectiveCreditMinimum = true;
                }
              }
              
              else{
                if(student.credits >= ams.credits){
                  satisfied += 1;
                  if(unsatisfied > 0){
                    unsatisfied -= 1;
                  }
                  else{
                    pending -= 1;
                  }
                  student.meetsCreditMinimum = true;
                }
                if(student.electiveCredits >= ams.numElectiveCoursesQF && !student.meetsElectiveCreditMinimum){
                  satisfied += 1;
                  if(unsatisfied > 0){
                    unsatisfied -= 1;
                  }
                  else{
                    pending -= 1;
                  }
                  student.meetsElectiveCreditMinimum = true;
                }
                changeGPA = true;
              }

              student.satisfied = satisfied;
              student.pending = pending;
              student.unsatisfied = unsatisfied;
              if(changeGPA){
                student.gpa = parseFloat(gpa);
              }
              
              resolve(student);
            })
            
          }

          else if(student.dept == 'BMI'){
            afs.collection('Degrees').doc('BMI' + student.entrySemester + student.entryYear).valueChanges().subscribe(bmiDoc => {
              bmi = bmiDoc;
              if(!bmi.nonElectives.includes(course)){
                student.credits += credits;
                changeGPA = true;
                if(student.track == 'Imaging, Thesis' || student.track == "Imaging, Project"){
                  if(bmi.electivesII.includes(course)){
                    student.electiveCredits += credits;
                  }
                }
                else if(student.track == 'Clinical, Thesis' || student.track == "Clinical, Project"){
                  if(bmi.electivesCI.includes(course)){
                    changeGPA = true;
                    student.electiveCredits += credits;
                  }
                }
                else{
                  if(bmi.electivesCI.includes(course)){
                    changeGPA = true;
                    student.electiveCredits += credits;
                  }
                }
                
                if(student.credits >= bmi.credits){
                  if(!student.meetsCreditMinimum){
                    satisfied += 1;
                    if(unsatisfied > 0){
                      unsatisfied -= 1;
                    }
                    else{
                      pending -= 1;
                    }
                  }
                  student.meetsCreditMinimum = true;
                }
              }
              student.satisfied = satisfied;
              student.pending = pending;
              student.unsatisfied = unsatisfied;
              if(changeGPA){
                student.gpa = parseFloat(gpa);
              }
            })
          }

          else if(student.dept == 'CSE'){
            afs.collection('Degrees').doc('CSE' + student.reqVersionSemester + student.reqVersionYear).valueChanges().subscribe(cseDoc => {
              cse = cseDoc;

              if(cse.theoryCourses.includes(course) && !student.hasCseTheoryCourse){
                changeGPA = true;
                student.credits += credits;
                student.hasCseTheoryCourse = true;
                satisfied += 1;
                if(unsatisfied > 0){
                  unsatisfied -= 1;
                }
                else{
                  pending -= 1;
                }
                
              }
              else if(cse.systemsCourses.includes(course) && !student.hasCseSystemsCourse){
                changeGPA = true;
                student.credits += credits;
                student.hasCseSystemsCourse = true;
                satisfied += 1;
                if(unsatisfied > 0){
                  unsatisfied -= 1;
                }
                else{
                  pending -= 1;
                }
              }
              else if(cse.iisCourses.includes(course) && !student.hasCseIISCourse){
                student.hasCseIISCourse = true;
                changeGPA = true;
                student.credits += credits;
                satisfied += 1;
                if(unsatisfied > 0){
                  unsatisfied -= 1;
                }
                else{
                  pending -= 1;
                }
              }
              if(student.track == 'Advanced Project'){
                
                if(!cse.notAllowedCoursesA.includes(course)){
                  console.log("holy shit")
                  changeGPA = true;
                  
                  student.credits += credits;
                 
                  student.electiveCredits += credits;
                ;
                } 
              }
              else if(student.track == 'Special Project'){
                if(!cse.notAllowedCoursesS.includes(course)){
                  if(cse.basicProjectCourses.includes(course)){
                    student.numCseBasicCourses += 1
                    if(student.numCseBasicCourses >= cse.minBasicProjectS && !student.hasCseBasicCourses){
                      student.hasCseBasicCourses = true;
                    }
                  }
                  changeGPA = true;
                  student.credits += credits;
                  student.electiveCredits += credits;
                  
                }
              }
              else{
                changeGPA = true;
                student.electiveCredits += credits;
                student.electiveCredits += credits;
              }

              if(student.credits >= cse.minCredits){
                if(!student.meetsCreditMinimum){
                  satisfied += 1;
                  if(unsatisfied > 0){
                    unsatisfied -= 1;
                  }
                  else{
                    pending -= 1;
                  }
                }
                student.meetsCreditMinimum = true;
              }
              console.log(student.credits);
              student.satisfied = satisfied;
              student.pending = pending;
              student.unsatisfied = unsatisfied;
              if(changeGPA){
                student.gpa = parseFloat(gpa);
              }
              resolve(student);
            })
          }
          else{
            student.electiveCredits += credits;
            student.credits += credits;
            changeGPA = true;
            if(!student.meetsCreditMinimum){
              afs.collection('Degrees').doc('ESE' + student.entrySemester + student.entryYear).valueChanges().subscribe(doc => {
                ece = doc;
                if(!student.hasEceHardwareCourse && ece.hardwareCourses.includes(course)){
                  student.numEceHardwareCourse += 1;
                  if(student.numEceHardwareCourse >= ece.numCreditsSubAreas1T){
                    student.hasEceHardwareCourse = true;
                  }
                }
                else if(!student.hasEceNetworkingCourse && ece.networkingCourses.includes(course)){
                  student.numEceNetworkCourse += 1;
                  if(student.numEceNetworkCourse >= ece.numCreditsSubAreas1T){
                    student.hasEceNetworkingCourse = true;
                  }
                }
                else if(!student.hasEceCadCourse && ece.cadCourses.includes(course)){
                  student.numEceCadCourse += 1;
                  if(student.numEceCadCourse >= ece.numCreditsSubAreas1T){
                    student.hasEceCadCourse = true;
                  }
                }
                else if(!student.hasEceTheoryCourse && ece.theoryCourses.includes(course)){
                  student.numEceTheoryCourse += 1;
                  if(student.numEceTheoryCourse >= ece.numCreditsSubAreas2T){
                    student.hasEceTheoryCourse = true;
                  }
                }
                if(student.track = "Non-Thesis"){
                  if(course == "ESE697"){
                    student.numEse697Credits += 1;
                  }
                  else if(ece.nonRegularCourses.includes(course)){
                    student.numEceRegularCredits += 1;
                  }
                  if(!student.hasEceRegularCredits && student.numEceRegularCredits >= ece.numRegularCoursesNT){
                    student.hasEceRegularCredits = true;
                    satisfied += 1;
                    if(unsatisfied > 0){
                      unsatisfied -= 1;
                    }
                    else{
                      pending -= 1;
                    }
                  }
                  if(!student.hasEce697Credits && student.numEse697Credits >= ece.minCreditsESE697NT){
                    student.hasEce697Credits = true;
                    satisfied += 1;
                    if(unsatisfied > 0){
                      unsatisfied -= 1;
                    }
                    else{
                      pending -= 1;
                    }
                  }
                  if(student.credits >= ece.creditMinimumNT){
                  
                    satisfied += 1;
                    if(unsatisfied > 0){
                      unsatisfied -= 1;
                    }
                    else{
                      pending -= 1;
                    }
                    
                    student.meetsCreditMinimum = true;
                  }
                }
                else{
                  if(course == "ESE697"){
                    student.numEse697Credits += 1;
                  }
                  else if(ece.nonRegularCourses.includes(course)){
                    student.numEceRegularCredits += 1;
                  }
                  else if(course == "ESE599"){
                    student.numEse599Credits += 1;
                  }
                  if(!student.hasEceRegularCredits && student.numEceRegularCredits >= ece.numRegularCoursesT){
                    student.hasEceRegularCredits = true;
                    satisfied += 1;
                    if(unsatisfied > 0){
                      unsatisfied -= 1;
                    }
                    else{
                      pending -= 1;
                    }
                  }
                  if(!student.hasEce697Credits && student.numEse697Credits >= ece.minCreditsESE697T){
                    student.hasEce697Credits = true;
                    satisfied += 1;
                    if(unsatisfied > 0){
                      unsatisfied -= 1;
                    }
                    else{
                      pending -= 1;
                    }
                  }
                  if(!student.hasEce599Credits && student.numEse599Credits >= ece.minCreditsESE599T){
                    student.hasEce599Credits = true;
                    satisfied += 1;
                    if(unsatisfied > 0){
                      unsatisfied -= 1;
                    }
                    else{
                      pending -= 1;
                    }
                  }
                  if(student.credits >= ece.creditMinimumT){
                  
                    satisfied += 1;
                    if(unsatisfied > 0){
                      unsatisfied -= 1;
                    }
                    else{
                      pending -= 1;
                    }
                    
                    student.meetsCreditMinimum = true;
                  }
                }
                student.satisfied = satisfied;
                student.pending = pending;
                student.unsatisfied = unsatisfied;
                if(changeGPA){
                  student.gpa = parseFloat(gpa);
                }
              })
            }
          }
        }
      }
      // student.gpa = parseFloat(gpa);
      // resolve(student);
    })
  }
}

