import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { Courses } from 'src/app/models/courses';
import { CourseService } from 'src/app/services/course.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Student } from '../../models/student';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-suggest-course-plan',
  templateUrl: './suggest-course-plan.component.html',
  styleUrls: ['./suggest-course-plan.component.css']
})
export class SuggestCoursePlanComponent implements OnInit {
  courseAdd: string[] = ['courseName'];
  courseAvoid: string[] = ['courseName'];
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

  constructor(public courseServices:CourseService, public afs: AngularFirestore, public router: Router) { 
  }
  coursesToAddList=[]
  coursesToAvoidList=[]
  ngOnInit(): void {
    this.semesterList = [];
    let arr = [];
    let courseOffArr = [];
    var courseNames = [];
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
    this.courseServices.getCourseOfferings().subscribe(s => {
      s.forEach(element => {
          courseOffArr.push(element);
      });
    });
    this.courseOfferings = courseOffArr;
    this.courses = arr;
    let deptArr = [];
    for (let i = 0; i < this.courses.length; i++) {
      if (this.courses[i].department = this.dept) {
        deptArr.push(this.courses[i]);
      }
    }
    this.coursesCopy = arr;
    this.router.routerState.root.queryParams.subscribe(params => {
      this.sbuID = params['sbuID'];
    });
    this.afs.collection('Students').doc(this.sbuID).valueChanges().subscribe(val => {
      this.s = val;
      this.gradSemester = this.s.gradSemester;
      this.gradYear = this.s.gradYear;
      this.requiredCourses = this.s.requiredCourses;
      this.credits = this.s.credits;
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
      this.courseAdd = ['courseName'];
    } else {
      this.courseAdd = ['courseName', 'weight', 'actions'];
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

  suggestCoursePlan(): void {
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
    var semester_list = this.semesterList;
    var cp_list = [];
    var fail_counter = 0;
  }

  suggestCoursePlanSmartMode(required_courses, preferred_courses, avoid_courses, electives_list, semester_list, day_start, day_end, max_n): void {

  }

  suggestCoursePlanDefaultMode(required_courses, preferred_courses, avoid_courses, electives_list, semester_list, day_start, day_end, max_n): void {
    var coursePlanDict = {};

    var currentCredits = this.credits;

    required_courses = required_courses.sort((a, b) => parseInt(a.substr(a.length - 3)) - parseInt(b.substr(b.length - 3)));
    var required_coursesCopy = this.requiredCourses;
    var prerequisitesList = {};

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
        var regex = /^[A-Z]{3}\s{1}[0-9]{3}$/;
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
      coursePlanDict[semester_list[i]] = [];
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
              prerequisitesList[j].splice(j, 1);
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
              prerequisitesList[j].splice(j, 1);
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
        return (hourInt * 100) + minute;
      }
    } else {
      if (hourInt === 12) {
        return 1200 + minuteInt;
      } else {
        return ((hourInt + 12) * 100) + minute;
      }
    }
  }

  extractPrerequisites(prerequisite) {
    var regex = /^[A-Z]{3}\s{1}[0-9]{3}$/;
    var matches = prerequisite.match(regex);
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
  } // This generator is adapted from: https://gist.github.com/cybercase/db7dde901d7070c98c48

  checkIfCoursePlanIsValid(coursePlan, dayStart, dayEnd, prerequisiteList) {
    var sem = Object.keys(coursePlan);
    var courses = Object.values(coursePlan);
    var cp = {};
    for (let i = 0; i < sem.length; i++) {
      let semArray = sem[i].split(" ");
      let semester = semArray[0];
      let year = semArray[1];
      for (let j = 0; j < courses[j].length; j++) {
        if (this.checkConstraints(courses[j], semester, year, dayStart, dayEnd, this.courseOfferings, cp, prerequisiteList) === 0) {
          return 0;
        }
      }
    }
    return 1;
  }
}

