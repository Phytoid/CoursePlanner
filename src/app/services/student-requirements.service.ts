import { StudentReq } from './../models/student-req';
import { AngularFirestore } from '@angular/fire/firestore';
import { ECE } from './../models/ece';
import { BMI } from './../models/bmi';
import { CSE } from './../models/cse';
import { AMS } from './../models/ams';
import { Student } from 'src/app/models/student';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class StudentRequirementsService {
  student: Student;
  

  constructor(private afs: AngularFirestore) { }

  setStudentRequirements(student: Student, degree){
    var dept = student.dept;
    var track = student.track;

    var docRef;
    var innerMap: Map<string, string> = new Map;
    var degreeReq = degree;

    if(dept == "AMS"){
      docRef = this.afs.collection("Degrees").doc("AMS"+ student.reqVersionSemester+ student.reqVersionYear);
      docRef.valueChanges().subscribe(val => {
        degreeReq = val;
      });
      innerMap.set("department", student.dept);
      innerMap.set("track", student.track);
      innerMap.set("versionSemester", degreeReq.versionSemester.toString());
      innerMap.set("versionYear", degreeReq.versionYear.toString());
      innerMap.set("gpa", degreeReq.gpa.toString());
      if(degreeReq.finalRec){
        innerMap.set("finalRecommendation", "true");
      }
      else{
        innerMap.set("finalRecommendation", "false");
      }
      innerMap.set("timeLimit", degreeReq.timeLimit.toString());
      if(track == "CAM"){  
        innerMap.set("requiredCourses", degreeReq.requiredCoursesCAM.toString());
        
      }
      else if(track == "CB"){
        innerMap.set("requiredCourses", degreeReq.requiredCoursesCB.toString());
        innerMap.set("numElectives", degreeReq.numElectiveCoursesCB.toString());
      }
      else if(track == "OR"){
        innerMap.set("requiredCourses", degreeReq.requiredCoursesOR.toString());
        innerMap.set("numStatCourses", degreeReq.numStatisticCoursesOR.toString());
        innerMap.set("statCourses", degreeReq.statisticCoursesOR.toString());
        innerMap.set("electiveCourses", degreeReq.electiveCoursesOR.toString());
      }
      else if(track == "STAT"){
        innerMap.set("requiredCourses", degreeReq.requiredCoursesSTAT.toString());
        innerMap.set("numElectives", degreeReq.numElectiveCoursesSTAT.toString());
      }
      else{
        innerMap.set("requiredCourses", degreeReq.requiredCoursesQF.toString());
        innerMap.set("numElectives", degreeReq.numElectiveCoursesQF.toString());
      }
    }
    else if(dept == "BMI"){
      //var degreeReq: BMI;
      
      innerMap.set("department", student.dept);
      innerMap.set("track", student.track);
      innerMap.set("versionSemester", degreeReq.versionSemester.toString());
      innerMap.set("versionYear", degreeReq.versionYear.toString());
      innerMap.set("gpa", degreeReq.gpa.toString());
      innerMap.set("maxTransferSBU", degreeReq.maxTransferCredits.toString());
      innerMap.set("maxTransferOther", degreeReq.maxTransferFromOther.toString());
      if(track == "Imaging, Thesis"){
        var courses = degreeReq.requiredCourses.concat(degreeReq.requiredCoursesII);
        courses = courses.concat(degreeReq.requiredCourseThesis);
        innerMap.set("requiredCourses", courses.toString());
        innerMap.set("maxCreditsFromBMI596", degreeReq.maxBMI596CreditsThesis.toString())
        innerMap.set("maxCreditsFromBMI599", degreeReq.maxBMI599CreditsThesis.toString())
      }
      else if(track == "Imaging, Project"){
        var courses = degreeReq.requiredCourses.concat(degreeReq.requiredCoursesII);
        courses = courses.concat(degreeReq.requiredCourseProject);
        innerMap.set("requiredCourses", courses.toString());
        innerMap.set("maxCreditsFromBMI596", degreeReq.maxBMI596CreditsProject.toString())
        innerMap.set("maxCreditsFromBMI598", degreeReq.maxBMI598CreditsProject.toString())
      }
      else if(track == "Clinical, Thesis"){
        var courses = degreeReq.requiredCourses.concat(degreeReq.requriedCoursesCI);
        courses = courses.concat(degreeReq.requiredCourseThesis);
        innerMap.set("requiredCourses", courses.toString());
        innerMap.set("maxCreditsFromBMI596", degreeReq.maxBMI596CreditsThesis.toString())
        innerMap.set("maxCreditsFromBMI599", degreeReq.maxBMI599CreditsThesis.toString())
      }
      else if(track == "Clinical, Project"){
        var courses = degreeReq.requiredCourses.concat(degreeReq.requriedCoursesCI);
        courses = courses.concat(degreeReq.requiredCourseProject);
        innerMap.set("requiredCourses", courses.toString());
        innerMap.set("maxCreditsFromBMI596", degreeReq.maxBMI596CreditsProject.toString())
        innerMap.set("maxCreditsFromBMI598", degreeReq.maxBMI598CreditsProject.toString())
      }
      else if(track == "Translational, Thesis"){
        var courses = degreeReq.requiredCourses.concat(degreeReq.requiredCoursesTBI);
        courses = courses.concat(degreeReq.requiredCourseThesis);
        innerMap.set("requiredCourses", courses.toString());
        innerMap.set("maxCreditsFromBMI596", degreeReq.maxBMI596CreditsThesis.toString())
        innerMap.set("maxCreditsFromBMI599", degreeReq.maxBMI599CreditsThesis.toString())
      }
      else{
        var courses = degreeReq.requiredCourses.concat(degreeReq.requiredCoursesTBI);
        courses = courses.concat(degreeReq.requiredCourseProject);
        innerMap.set("requiredCourses", courses.toString());
        innerMap.set("maxCreditsFromBMI596", degreeReq.maxBMI596CreditsProject.toString())
        innerMap.set("maxCreditsFromBMI598", degreeReq.maxBMI598CreditsProject.toString())
      }
    }
    else if(dept == "CSE"){
    
      docRef = this.afs.collection("Degrees").doc("CSE"+ student.reqVersionSemester+ student.reqVersionYear);
      docRef.valueChanges().subscribe(val => {
        degreeReq = val
      });
      innerMap.set("department", student.dept);
      innerMap.set("track", student.track);
      innerMap.set("versionSemester", degreeReq.versionSemester.toString());
      innerMap.set("versionYear", degreeReq.versionYear.toString());
      innerMap.set("gpa", degreeReq.gpa.toString());
      innerMap.set("credits", degreeReq.minCredits.toString());
      innerMap.set("maxCreditsCSE599", degreeReq.maxCreditsCSE599.toString());
      innerMap.set("maxCreditsCSE587", degreeReq.maxCreditsCSE587.toString());
      if(track == "Advanced Project"){
        innerMap.set("requiredCourses", degreeReq.requiredCoursesA.toString());
        innerMap.set("notAllowedElectives", degreeReq.notAllowedCoursesA.toString());
        innerMap.set("thesis", "false");
      }
      else if(track == "Special Project"){
        innerMap.set("requiredCourses", degreeReq.requiredCoursesS.toString());
        innerMap.set("notAllowedElectives", degreeReq.notAllowedCoursesS.toString());
        innerMap.set("basicProjectCourses", degreeReq.basicProjectCourses.toString());
        innerMap.set("minBasicCourses", degreeReq.minBasicProjectS.toString());
        innerMap.set("electiveCourses", degreeReq.everythingCoursesS.toString());
        innerMap.set("minElectiveCredits", degreeReq.minCreditEverythingS.toString());
        innerMap.set("specialCourses",degreeReq.maxSpecialCoursesS.toString());
        innerMap.set("maxSpecialCoursesCredit", degreeReq.maxSpecialCreditsS.toString());
        innerMap.set("thesis", "false");
      }
      else{
        innerMap.set("requiredCourses", degreeReq.requiredCoursesT.toString());
        innerMap.set("thesis", "true");
      }
    }
    else{

      docRef = this.afs.collection("Degrees").doc("ESE"+ student.reqVersionSemester+ student.reqVersionYear);
      docRef.valueChanges().subscribe(val => {
        degreeReq = val
      });
      innerMap.set("department", student.dept);
      innerMap.set("track", student.track);
      innerMap.set("versionSemester", degreeReq.versionSemester.toString());
      innerMap.set("versionYear", degreeReq.versionYear.toString());
      innerMap.set("gpa", degreeReq.gpaT.toString());
      innerMap.set("credits", degreeReq.creditMinimumNT.toString());
      innerMap.set("hardwareCourses", degreeReq.hardwareCourses.toString());
      innerMap.set("networkingCourses", degreeReq.networkingCourses.toString());
      innerMap.set("cadCourses", degreeReq.cadCourses.toString());
      innerMap.set("theoryCourses", degreeReq.theoryCourses.toString());
      innerMap.set("nonRegularCourses", degreeReq.nonRegularCourses.toString());
      innerMap.set("maxTransferCredits", degreeReq.maxTransferCredits.toString());
      
      if(track == "Non-Thesis"){
        innerMap.set("minRegularCourses", degreeReq.numRegularCoursesNT.toString());
        innerMap.set("thesis", "false");
        innerMap.set("minCreditsESE697", degreeReq.minCreditsESE697NT.toString())
        innerMap.set("minCreditsHardware", degreeReq.numCreditsSubAreas1NT.toString());
        innerMap.set("minCreditsNetworking", degreeReq.numCreditsSubAreas1NT.toString());
        innerMap.set("minCreditsCAD", degreeReq.numCreditsSubAreas1NT.toString());
        innerMap.set("minCreditsTheory", degreeReq.numCreditsSubAreas2NT.toString());
      }
      else{
        innerMap.set("minRegularCourses", degreeReq.numRegularCoursesT.toString());
        innerMap.set("thesis", "true");
        innerMap.set("minCreditsESE599", degreeReq.minCreditsESE599T.toString());
        innerMap.set("minCreditsESE697", degreeReq.minCreditsESE697T.toString())
        innerMap.set("minCreditsHardware", degreeReq.numCreditsSubAreas1T.toString());
        innerMap.set("minCreditsNetworking", degreeReq.numCreditsSubAreas1T.toString());
        innerMap.set("minCreditsCAD", degreeReq.numCreditsSubAreas1T.toString());
        innerMap.set("minCreditsTheory", degreeReq.numCreditsSubAreas2T.toString());
      }
    }
    
    student.requiredCourses = innerMap.get('requiredCourses').split(',');
    if(student.dept != 'ESE')
      this.afs.firestore.collection('Students').doc(student.id).set(student);
    else{
      this.afs.firestore.collection('Students').doc(student.id).set({
        hardwareCourses: innerMap['hardwareCourses'],
        networkingCourses: innerMap['networkingCourses'],
        cadCourses: innerMap['cadCourses'],
        theoryCourses: innerMap['theoryCourses'],
      });
    }
    // var map = new Map;
    // map.set("studentReqs", innerMap)
    // this.afs.firestore.collection('StudentRequirements').doc(student.id).set({
    //     degreeReq: null
    //   }
    // ).then(() => {
    //   console.log("Added to database");
    // }).catch((error) => {
    //   console.log("Problem adding  to database");
    // });
    // for(var key of innerMap.keys()) {
    //   var k: string = key.toString();
      
    //   console.log(k + " " + innerMap.get(k))
    //   this.afs.firestore.collection('StudentRequirements').doc(student.id).update({
        
    //       ['degreeReq' + '.' + k] : innerMap.get(key) 
    //     }
    //   ).then(() => {
    //     console.log("Added to database");
    //   }).catch((error) => {
    //     console.log("Problem adding  to database");
    //   });
    // }
    // console.log(sr.map)
    // var sr: StudentReq = {map : innerMap};
    // this.afs.firestore.collection('StudentRequirements').doc(student.id).set({}).then(() => {
    //   console.log("Added to database");
    // }).catch((error) => {
    //   console.log("Problem adding  to database");
    // });
  }
}
