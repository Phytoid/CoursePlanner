import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { Courses } from 'src/app/models/courses';
import { CourseService } from 'src/app/services/course.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { MatYearView } from '@angular/material/datepicker';
import { Student } from 'src/app/models/student';
import { AMS } from 'src/app/models/ams';
import { BMI } from 'src/app/models/bmi';
import { CSE } from 'src/app/models/cse';
import { ECE } from 'src/app/models/ece';

@Component({
  selector: 'app-suggest-course-plan',
  templateUrl: './suggest-course-plan.component.html',
  styleUrls: ['./suggest-course-plan.component.css']
})

export class SuggestCoursePlanComponent implements OnInit {
  limitCourses=[];
  prefWeight: number = 0;
  //maxCourses: number = 0;
  courseAdd: string[] = ['add'];
  courseAvoid: string[] = ['avoid'];
  timeStart=[]
  timeEnd=[]
  sem=[];
  year=[];
  // c: string[] = ["a","b","c","d","e","f","g","h","i","j","k","l"];
  @ViewChild(MatTable) table: MatTable<any>;
  courses: Courses[];
  courseNames: string[];
  coursesCopy: Courses[];
  sbuID: string;
  gradYear: string;
  gradSemester: string;
  semesterList: string[];
  s: Student;
  prefDataSource: any;
  requiredCourses: string[];
  dept: string;
  coursesAlreadyTaken: string[];
  coursePlan: Map<string, Map<string, string>>;
  courseOfferings: Courses[];
  credits: number;
  creditsNeededTotal: number;
  track: string;
  departmentCourses: string[];
  electives: string[];
  reqYear: string;
  reqSemester: string;
  ams: AMS;
  bmi: BMI;
  cse: CSE;
  ece: ECE;
  degreeRequirementsPresent: boolean;


  constructor(public courseServices:CourseService, public afs: AngularFirestore, public router: Router) { 
  }
  coursesToAddList=[]
  coursesToAvoidList=[]
  ngOnInit(): void {
    this.semesterList = [];
    var arr = [];
    this.degreeRequirementsPresent = false;
    var courseOffArr = [];
    var courseNames = [];
    var deptArr = [];

    // Get all courses
    this.courseServices.getCourses().subscribe(s => {
      s.forEach(element => {
          arr.push(element);
      });
      for (let i = 0; i < arr.length; i++) {
        courseNames.push((arr[i].course.substring(0,3) + " " + arr[i].course.substring(3,6)));
      }
      var coursesNamesSet = new Set(courseNames);
      var courseNamesSetArray = Array.from(coursesNamesSet);
      this.courseNames = courseNamesSetArray;
    });
    this.courses = arr;

    // Get all course offerings
    this.courseServices.getCourseOfferings().subscribe(s => {
      s.forEach(element => {
          courseOffArr.push(element);
      });
    });
    this.courseOfferings = courseOffArr;

    // Get all courses for the department
    for (let i = 0; i < this.courses.length; i++) {
      if (this.courses[i].department = this.dept) {
        deptArr.push(this.courses[i]);
      }
    }
    this.departmentCourses = deptArr;

    // Make a copy of all courses
    this.coursesCopy = arr;

    // Get degree requirements
    let degreeRequirements = [];
    this.courseServices.getDegreeReqs().subscribe(s => {
      s.forEach(element => {
          degreeRequirements.push(element);
      });
    });
    for (let i = 0; i < degreeRequirements.length; i++) {
      if (degreeRequirements[i].department.toLocaleUpperCase() === this.dept.toLocaleUpperCase() && degreeRequirements[i].versionSemester.toLocaleLowerCase() === this.reqSemester.toLocaleLowerCase() && degreeRequirements[i].versionYear === this.reqYear) {
        if (this.dept.toLocaleUpperCase() === 'AMS') {
          this.ams = degreeRequirements[i];
          this.degreeRequirementsPresent = true;
          break;
        } else if (this.dept.toLocaleUpperCase() === 'BMI') {
          this.bmi = degreeRequirements[i];
          this.degreeRequirementsPresent = true;
          break;
        } else if (this.dept.toLocaleUpperCase() === 'CSE') {
          this.cse = degreeRequirements[i];
          this.degreeRequirementsPresent = true;
          break;
        } else if (this.dept.toLocaleUpperCase() === 'ECE') {
          this.ece = degreeRequirements[i];
          this.degreeRequirementsPresent = true;
          break;
        }
      }
    }

    // Get SBU ID from params
    this.router.routerState.root.queryParams.subscribe(params => {
      this.sbuID = params['sbuID'];
    });
    this.afs.collection('Students').doc(this.sbuID).valueChanges().subscribe(val => {
      this.s = val;
      this.gradSemester = this.s.gradSemester;
      this.gradYear = this.s.gradYear;
      this.reqSemester = this.s.reqVersionSemester;
      this.reqYear = this.s.reqVersionYear;
      this.requiredCourses = this.s.requiredCourses;
      this.credits = this.s.credits;
      this.creditsNeededTotal = this.s.numCreditsNeededToGraduate;
      this.track = this.s.track;
      for (let i = 0; i < this.requiredCourses.length; i++) {
        this.requiredCourses[i] = this.requiredCourses[i].substring(0,3) + " " + this.requiredCourses[i].substring(3,6);
      }
      this.dept = this.s.dept;
      this.coursePlan = this.s.coursePlan;
      for (let i = 2021; i <= parseInt(this.s.gradYear); i++) {
        if (i == 2021) {
          if (this.s.gradSemester === 'Spring' && this.s.gradYear === '2021') {
            return;
          } else {
            this.semesterList.push('Fall ' + i.toString());
          }
        } else {
          if (i == parseInt(this.s.gradYear)) {
            if (this.s.gradSemester === 'Spring') {
              this.semesterList.push('Spring ' + i.toString());
              return;
            } else {
              this.semesterList.push('Spring ' + i.toString());
              this.semesterList.push('Fall ' + i.toString());
              return;
            }
          } else {
            this.semesterList.push('Spring ' + i.toString());
            this.semesterList.push('Fall ' + i.toString());
          }
        }
      }
      var gradesMaps = Object.entries(this.s.coursePlan);
      var grades = [];
      for (let i = 0; i <gradesMaps.length; i++) {
        grades.push(gradesMaps[i][1])
      }
      for (let i = 0; i < grades.length; i++) {
        var letterGrades = Object.values(grades);
        var courseNames = Object.keys(grades);
        var passingGrades = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C']
        for (let j = 0; j < letterGrades.length; j++) {
          if (passingGrades.includes(letterGrades[j])) {
            this.coursesAlreadyTaken.push(courseNames[j]);
          }
        }
      }
    });
  }

  ngAfterInit(): void{
    this.afs.collection('Students').doc(localStorage.getItem('sbuID')).valueChanges().subscribe(val => {
      console.log(val);
    });
    location.reload();
  }

  addItemPref(event): void {
    var course = event.value;
    for (let i = 0; i < this.coursesToAddList.length; i++) {
      if (course === this.coursesToAddList[i].courseName) {
        return;
      }
    }
    this.coursesToAddList = this.coursesToAddList.concat({courseName: course, weight: 1}); 
  }

  addItemAvoid(event): void{
    var course = event.value;
    for (let i = 0; i < this.coursesToAvoidList.length; i++) {
      if (course === this.coursesToAddList[i].courseName) {
        return;
      }
    }
    this.coursesToAvoidList = this.coursesToAvoidList.concat({courseName: course}); 
  }

  checkboxCheck() {
    var cb = document.getElementById("weightCheckbox") as HTMLInputElement;
    if (cb.checked == false) {
      this.courseAdd = ['add'];
    } else {
      this.courseAdd = ['add', 'weight', 'actions'];
    }
  }

  moveUp(row): void{
    var index = -1;
    for (let i = 0; i < this.coursesToAddList.length; i++) {
      if (row.courseName === this.coursesToAddList[i].courseName) {
        index = i;
      }
    }
    if (index !== 0) {
      const tmp = this.coursesToAddList[index]
      this.coursesToAddList[index] = this.coursesToAddList[index - 1]
      this.coursesToAddList[index - 1] = tmp
    }
    this.table.renderRows()
  }

  moveDown(row): void{
    var index = -1;
    for (let i = 0; i < this.coursesToAddList.length; i++) {
      if (row.courseName === this.coursesToAddList[i].courseName) {
        index = i;
      }
    }
    if (index !== (this.coursesToAddList.length - 1)) {
      const tmp = this.coursesToAddList[index]
      this.coursesToAddList[index] = this.coursesToAddList[index + 1]
      this.coursesToAddList[index + 1] = tmp
    }
    this.table.renderRows()
  }

  timeSlotStart(event): void{
    var timeslot = event.target.value;
    var arr=[];
    arr = arr.concat(timeslot);
    this.timeStart = arr;
    console.log(this.timeStart);
  }

  timeSlotEnd(event): void{
    var timeslot = event.target.value;
    var arr=[];
    arr = arr.concat(timeslot);
    this.timeEnd = arr;
    console.log(this.timeEnd);
  }

  coursesSemYear(event): void{
    //event.target.value
    var courses = event.target[0].value;
    var x = event.target[1].value;
    var y = event.target[2].value;
    this.limitCourses.push(courses);
    this.sem.push(x);
    this.year.push(y);
    //this.maxCourses = courses;
    console.log(this.courses);
    console.log(this.sem);
    console.log(this.year);
  }

  suggestCoursePlan(): void {
    if (this.degreeRequirementsPresent === false) {
      alert("No degree requirements are currently available with requirement version " + this.reqSemester + " " + this.reqYear);
      return;
    }
    var preferred_courses = [];
    for (let i = 0; i < this.coursesToAddList.length; i++) {
      preferred_courses.push(this.coursesToAddList[i].courseName);
    }
    var avoid_courses = [];
    for (let i = 0; i < this.coursesToAvoidList.length; i++) {
      avoid_courses.push(this.coursesToAddList[i].courseName);
    }
    var required_courses = this.requiredCourses;
    for (let i = 0; i < required_courses.length; i++) {
      if (required_courses[i].includes("/")) {
        var optionalArray = required_courses[i].split("/");
        var index = Infinity;
        var preferredCourse = "";
        for (let j = 0; j < optionalArray.length; j++) {
          if (preferred_courses.includes(optionalArray[j])) {
            let preferredIndex = preferred_courses.indexOf(optionalArray[j]);
            if (preferredIndex < index) {
              index = preferredIndex;
              preferredCourse = optionalArray[j];
            }
          }
        }
        if (index !== Infinity) {
          required_courses[i] = preferredCourse;
        } else {
          required_courses[i] = optionalArray[0];
        }
      } else {
        continue;
      }
    }
    if (this.dept.toLocaleUpperCase() === 'AMS') {
      if (this.track.toLocaleUpperCase() === 'OR') {
        this.electives = this.ams.electiveCoursesOR;
      } else {
        this.electives = this.departmentCourses;
      }
    } else if (this.dept.toLocaleUpperCase() === 'ECE') {
      this.electives = this.ece.cadCourses.concat(this.ece.hardwareCourses).concat(this.ece.networkingCourses).concat(this.ece.theoryCourses);
    } else if (this.dept.toLocaleUpperCase() === 'BMI') {
      if (this.track.toLocaleLowerCase().includes("clinical")) {
        this.electives = this.bmi.electivesCI;
      } else if (this.track.toLocaleLowerCase().includes("translational")) {
        this.electives = this.bmi.electiveCoursesTBI;
      } else {
        this.electives = this.bmi.electivesII;
      }
    } else {
      this.electives = this.cse.iisCourses.concat(this.cse.systemsCourses).concat(this.cse.theoryCourses);
      if (this.track.toLocaleLowerCase().includes("advanced")) {
        this.electives = this.electives.filter((element) => !this.cse.notAllowedCoursesA.includes(element));
      } else if (this.track.toLocaleLowerCase().includes("special")) {
        this.electives = this.electives.filter((element) => !this.cse.notAllowedCoursesS.includes(element));
      }
    }
    var semester_list = this.semesterList;
    var cp_list = [];
  }

  suggestCoursePlanSmartMode(required_courses, preferred_courses, avoid_courses, electives_list, semester_list, day_start, day_end, max_n) {

  }

  suggestCoursePlanDefaultMode(required_courses, preferred_courses, avoid_courses, electives_list, semester_list, day_start, day_end, max_n) {
    var coursePlanDict = {};
    required_courses = required_courses.sort((a, b) => parseInt(a.substr(a.length - 3)) - parseInt(b.substr(b.length - 3)));
    var required_coursesCopy = this.requiredCourses;
    var prerequisitesList = {};
    var creditList = {};

    for (let i = 0; i < this.courses.length; i++) {
      creditList[this.courses[i].course.substring(0,3) + " " + this.courses[i].course.substring(4,6)] = this.courses[i].credits;
    }

    // MAKE SURE ALL COURSES WITH PREREQUISITES COME AFTER IT IN THE LIST
    for (let i = 0; i < required_courses.length; i++) {
      var maxYearSeen = -1;
      var prerequisite = "";
      for (let j = 0; j < this.courses.length; i++) {
        if (this.courses[j].department.toLocaleUpperCase() == required_courses[i].substring(0, 3).toLocaleUpperCase() && this.courses[j].courseID == required_courses[i].substring(4, 6)) {
          if (this.courses[j].year > maxYearSeen) {
            maxYearSeen = this.courses[j].year;
            prerequisite = this.courses[j].graduatePreq;
          }
        }
      }
      prerequisitesList[required_courses[i].substring(0, 3) + " " + required_courses[i].substring(4, 6)] = prerequisite;
      if (prerequisite == "") {
        continue;
      } else {
        var regex = /[A-Z]{3}\s{1}[0-9]{3}/;
        var matches = prerequisite.match(regex);
        for (let j = 0; j < matches.length; j++) {
          if (parseInt(matches[j].substring(4,6)) > 499) { // If it is a graduate course
            if (matches[j] in this.coursesAlreadyTaken === false) { // If it has not already been taken
              if (matches[j] in required_courses.slice(0, i) === false) { // If it did not already come before it in the list of required courses
                if (matches[j] in required_courses.slice(i, required_courses.length)) {
                  let ind = required_courses.indexOf(matches[j]);
                  let temp = required_courses[ind];
                  required_courses[ind] = required_courses[i];
                  required_courses[i] = temp;
                } else {
                  required_courses.splice(i, 0, matches[j]);
                  i++;
                }
              }
            }
          }
        }
      }
    }

    // IF YOU WANT TO AVOID A CLASS YOU NEED TO GRADUATE, HOW DO YOU EXPECT TO GRADUATE?
    if (avoid_courses.some(item => required_courses.includes(item))) {
      alert("A course required to graduate is in your list of courses to avoid. Please reconsider your parameters and try again.");
      return null;
    }

    for (let i = 0; i < semester_list; i++) {
      if (this.track.toLocaleUpperCase() === 'BMI') {
        coursePlanDict[semester_list[i]] = ['BMI 592'];
      } else {
        coursePlanDict[semester_list[i]] = [];
      }
    }

    // ADD ANOTHER SEMESTER IF WE CANNOT GRADUATE IN TIME
    if (max_n.reduce(function(a, b){return a + b}, 0) > required_courses.length) {
      var sem_array = semester_list[semester_list.length - 1].split(" ")
      let sem = sem_array[0];
      let year = sem_array[1];
      if (sem.toLocaleLowerCase() === 'spring') {
        semester_list.push("Fall ".concat(year));
      } else {
        let yearInt = parseInt(year);
        semester_list.push("Spring ".concat((year + 1).toString()));
      }
    }
    
    // SEE IF COURSE OFFERINGS ARE AVAILABLE FOR THAT SEMESTER
    var courseOfferingsAvailableArray = [];
    for (let i = 0; i < semester_list.length; i++) {
      var semesterArray = semester_list[i].split(" ");
      var semester = semesterArray[0];
      var year = semesterArray[1];
      var courseOfferingFound = false;
      for (let j = 0; j < this.courseOfferings.length; j++) {
        if (this.courseOfferings[j].semester.toLocaleLowerCase() === semester.toLocaleLowerCase() && this.courseOfferings[j].year === year) {
          courseOfferingFound = true;
          courseOfferingsAvailableArray.push(true);
          break;
        }
      }
      if (courseOfferingFound === false) {
        courseOfferingsAvailableArray.push(false);
      }
    }

    // ADD COURSES WHERE COURSE OFFERINGS ARE AVAILABLE
    for (let i = 0; i < courseOfferingsAvailableArray.length; i++) {
      if (courseOfferingsAvailableArray[i] == true) {
        var semesterArray = semester_list[i].split(" ")
        for (let j = 0; j < required_courses.length; j++) {
          if (coursePlanDict[semester_list[i]].length === max_n[i]) {
            break;
          } else {
            if (this.checkConstraints(required_courses[j], semesterArray[0], semesterArray[1], day_start, day_end, this.courseOfferings, coursePlanDict, prerequisitesList) === 1) {
              coursePlanDict[semester_list[i]] = coursePlanDict[semester_list[i]].push(required_courses[j]);
              required_courses[j].splice(j, 1);
              j--;
            } else {
              continue;
            }
          }
        }
      } else {
        continue;
      }
    }

    // ADD COURSES WHERE COURSE OFFERINGS ARE NOT AVAILABLE
    for (let i = 0; i < courseOfferingsAvailableArray.length; i++) {
      if (courseOfferingsAvailableArray[i] == false) {
        var semesterArray = semester_list[i].split(" ")
        for (let j = 0; j < required_courses.length; j++) {
          if (coursePlanDict[semester_list[i]].length === max_n[i]) {
            break;
          } else {
            if (this.checkConstraints(required_courses[j], semesterArray[0], semesterArray[1], day_start, day_end, null, coursePlanDict, prerequisitesList) === 1) {
              coursePlanDict[semester_list[i]] = coursePlanDict[semester_list[i]].push(required_courses[j]);
              required_courses[j].splice(j, 1);
              j--;
            } else {
              continue;
            }
          }
        }
      } else {
        continue;
      }
    }

    // BRUTE FORCE
    if (required_courses.length !== 0) {
      var coursePlanFound = false;
      let permutations = this.exhaustive([...Array(semester_list.length).keys()].shift(), required_coursesCopy.length);
      for (let i = 0; i < permutations.length; i++) {
        var testCoursePlan = {};
        for (let j = 0; j < permutations[i].length; j++) {
          let sem = semester_list[permutations[i][j]];
          testCoursePlan[sem] = testCoursePlan[sem].push(required_courses[j]);
        }
        if (this.checkIfCoursePlanIsValid(testCoursePlan, day_start, day_end, prerequisitesList) == 1) {
          coursePlanDict = testCoursePlan;
          coursePlanFound = true;
          break;
        }
      }
      if (coursePlanFound === false) {
        alert("Even extending your proposed graduation by a semester, there is no possible course plan.");
        return null;
      }
    }

    if (this.canGraduate(coursePlanDict, this.requiredCourses) === true) {
      return(coursePlanDict);
    }

    if (preferred_courses.length !== 0) {
      var cb = document.getElementById("weightCheckbox") as HTMLInputElement;
      if (cb.checked === false) {
        this.shuffle(preferred_courses);
      } else {
        this.shuffle(semester_list);
      }
      for (let i = 0; i < preferred_courses.length; i++) {
        for (let j = 0; j < semester_list; j++) {
          let semesterArray = semester_list[j].split(" ")
          if (this.checkConstraints(preferred_courses[i], semesterArray[0], semesterArray[1], day_start, day_end, this.courseOfferings, coursePlanDict, prerequisitesList) === 1) {
            coursePlanDict[semester_list[j]] = coursePlanDict[semester_list[j]].push(preferred_courses[i]);
            preferred_courses[i].splice(i, 1);
            i--;
          }
        }
      }
    }

    if (this.canGraduate(coursePlanDict, this.requiredCourses) === true) {
      return(coursePlanDict);
    }

    electives_list = electives_list.filter((element) => !required_coursesCopy.includes(element));
    electives_list = electives_list.filter((element) => !preferred_courses.includes(element));

    if (electives_list.length !== 0) {
      this.shuffle(electives_list);
      for (let i = 0; i < electives_list.length; i++) {
        for (let j = 0; j < semester_list; j++) {
          let semesterArray = semester_list[j].split(" ")
          if (this.checkConstraints(electives_list[i], semesterArray[0], semesterArray[1], day_start, day_end, this.courseOfferings, coursePlanDict, prerequisitesList) === 1) {
            coursePlanDict[semester_list[j]] = coursePlanDict[semester_list[j]].push(electives_list[i]);
            electives_list[i].splice(i, 1);
            i--;
          }
        }
      }
    }

    if (this.canGraduate(coursePlanDict, this.requiredCourses) === true) {
      return(coursePlanDict);
    } else {
      return null;
    }
    


  }

  checkConstraints(course, semester, year, dayStart, dayEnd, courseOfferings, currentCoursePlan, prerequisiteList) {
    var courseDept = course.substring(0, 3);
    var courseID = course.substring(4, course.length);
    let array = [];
    for (var key in currentCoursePlan) {
      array.push(currentCoursePlan[key]);
    }
    var prerequisite = prerequisiteList[course];
    var pre = prerequisite.split("/");
    if (courseOfferings != null) { 
      for (let i = 0; i < courseOfferings.length; i++) {
        if (courseOfferings[i].semester.toLocaleLowerCase() === semester.toLocaleLowerCase() && courseOfferings[i].year === year && courseOfferings[i].department.toLocaleUpperCase() === courseDept.toLocaleUpperCase() && courseOfferings[i].courseID === courseID) {
          if (this.convertTime(dayStart) < this.convertTime(courseOfferings[i].startTime) && this.convertTime(dayEnd) > this.convertTime(courseOfferings[i].endTime)) {
            if (this.withinSemesterOverlap(currentCoursePlan, semester, year, courseOfferings) === true) {
              for (let j = 0; j < array.length; j++) {
                if (pre === "") {
                  return 1;
                }
                for (let k = 0; k < pre.length; k++) {
                  if (array[j].includes(prerequisite[k])) {
                    if (this.semesterList.indexOf(semester + year) > j) {
                      return 1;
                    } else {
                      continue;
                    }
                  }
                }
                return 0;
              }
            } else {
              return 0;
            }
          } else {
            return 0;
          }
        } else {
          return 0;
        }
      }
    } else {
      for (let j = 0; j < array.length; j++) {
        for (let k = 0; k < pre.length; k++) {
          if (array[j].includes(prerequisite[k])) {
            if (this.semesterList.indexOf(semester + year) > j) {
              return 1;
            } else {
              continue;
            }
          }
        }
        return 0;
      }
    }
  }

  convertTime(str) {
    var number = str.substring(0, str.length - 2);
    var numberArray = number.split(":");
    var hour = numberArray[0];
    var hourInt = parseInt(hour);
    var minute = numberArray[1];
    var minuteInt = parseInt(minute);
    var mornOrNight = str.substring(str.length - 2, str.length);
    if (mornOrNight.toLocaleLowerCase() == 'am') {
      if (hourInt === 12) {
        return minuteInt;
      } else {
        return (hourInt * 100) + minuteInt;
      }
    } else {
      if (hourInt === 12) {
        return 1200 + minuteInt;
      } else {
        return ((hourInt + 12) * 100) + minuteInt;
      }
    }
  }

  extractPrerequisites(prerequisite) {
    var regex = /[A-Z]{3}\s{1}[0-9]{3}/;
    var matches = prerequisite.match(regex);
    if (matches === null) {
      return "";
    }
    var returnString = "";
    for (let i = 0; i < matches.length; i++) {
      if (parseInt(matches[i].substring(4,6)) > 499) {
        if (returnString === "") {
          returnString = matches[i];
        } else {
          returnString = returnString + "/" + matches[i];
        }
      }
    }
    return returnString;
  }

  exhaustive(numberOfSemesters, numberOfRequiredCourses) {
    var argv = Array.prototype.slice.call(arguments);
    var argc = argv.length;
    if (argc === 2 && !isNaN(argv[argc - 1])) {
      var copies = [];
      for (var i = 0; i < argv[argc - 1]; i++) {
        copies.push(argv[0].slice()); // Clone
      }
      argv = copies;
    }
    return argv.reduce(function tl(accumulator, value) {
      var tmp = [];
      accumulator.forEach(function(a0) {
        value.forEach(function(a1) {
          tmp.push(a0.concat(a1));
        });
      });
      return tmp;
    }, [[]]);
  } // The code in this permutation generator is largely taken from: https://gist.github.com/cybercase/db7dde901d7070c98c48

  checkIfCoursePlanIsValid(coursePlan, dayStart, dayEnd, prerequisiteList) {
    var sem = Object.keys(coursePlan);
    var courses = Object.values(coursePlan);
    var cp = {};
    for (let i = 0; i < sem.length; i++) {
      let semArray = sem[i].split(" ");
      let semester = semArray[0];
      let year = semArray[1];
      //for (let j = 0; j < courses[j].length; j++) {
        //if (this.checkConstraints(courses[j], semester, year, dayStart, dayEnd, this.courseOfferings, cp, prerequisiteList) === 0) {
          //return 0;
        //}
      //}
    }
    return 1;
  }

  canGraduate(coursePlan, requiredCourses) {
    let newCredits = 0;
    let oldCredits = this.credits;
    if (requiredCourses !== []) {
      return false;
    }
    let dicts = Object.values(coursePlan);
    let courses = Object.values(dicts);
    for (let i = 0; i < courses.length; i++) {
      //for (let j = 0; j < courses[i].length; j++) {
        //newCredits += courses[i][j].credits;
      //} 
    }
    if (newCredits + oldCredits < this.creditsNeededTotal) {
      return false;
    }
    return true;
  }

  withinSemesterOverlap(coursePlan, semester, year, courseOfferings) {
    var concat = semester + " " + year;
    var desired_courses = coursePlan[concat];
    var monday = [];
    var tuesday = [];
    var wednesday = [];
    var thursday = [];
    var friday = [];
    for (let i = 0; i < desired_courses.length; i++) {
      for (let j = 0; j < courseOfferings.length; j++) {
        if (courseOfferings[j].semester.toLocaleLowerCase() === semester.toLocaleLowerCase() && courseOfferings[j].year === year && courseOfferings[j].department.toLocaleUpperCase() === desired_courses[i].department.toLocaleUpperCase() && courseOfferings[j].courseID === desired_courses[i].courseID) {
          if (courseOfferings[j].day.toLocaleUpperCase().includes("M")) {
            monday.push([this.convertTime(courseOfferings[j].startTime), this.convertTime(courseOfferings[j].endTime)])
          }
          if (courseOfferings[i].day.toLocaleUpperCase().includes("TU")) {
            tuesday.push([this.convertTime(courseOfferings[j].startTime), this.convertTime(courseOfferings[j].endTime)])
          }
          if (courseOfferings[i].day.toLocaleUpperCase().includes("W")) {
            wednesday.push([this.convertTime(courseOfferings[j].startTime), this.convertTime(courseOfferings[j].endTime)])
          }
          if (courseOfferings[i].day.toLocaleUpperCase().includes("TH")) {
            thursday.push([this.convertTime(courseOfferings[j].startTime), this.convertTime(courseOfferings[j].endTime)])
          }
          if (courseOfferings[i].day.toLocaleUpperCase().includes("F")) {
            friday.push([this.convertTime(courseOfferings[j].startTime), this.convertTime(courseOfferings[j].endTime)])
          } 
        }
      }
    }
    monday.sort(([a, b], [c, d]) => a - c || b - d);
    tuesday.sort(([a, b], [c, d]) => a - c || b - d);
    wednesday.sort(([a, b], [c, d]) => a - c || b - d);
    thursday.sort(([a, b], [c, d]) => a - c || b - d);
    friday.sort(([a, b], [c, d]) => a - c || b - d);
    for (let i = 0; i < monday.length - 1; i++) {
      if (monday[i][1] > monday[i+1][0]) {
        return false;
      }
    }
    for (let i = 0; i < tuesday.length - 1; i++) {
      if (tuesday[i][1] > tuesday[i+1][0]) {
        return false;
      }
    }
    for (let i = 0; i < wednesday.length - 1; i++) {
      if (wednesday[i][1] > wednesday[i+1][0]) {
        return false;
      }
    }
    for (let i = 0; i < thursday.length - 1; i++) {
      if (thursday[i][1] > thursday[i+1][0]) {
        return false;
      }
    }
    for (let i = 0; i < friday.length - 1; i++) {
      if (friday[i][1] > friday[i+1][0]) {
        return false;
      }
    }
    return true;
  }

  shuffle(a) { // MODERN VERSION OF THE FISHER-YATES SHUFFLE ALGORITHM
    for (let i = a.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
  } // THIS FUNCTION TAKEN FROM : https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
}

