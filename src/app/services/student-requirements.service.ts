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

  async setStudentRequirements(student: Student, degree){
    var dept = student.dept;
    var track = student.track;

    var docRef;
    var degreeReq;

 
    if(dept == "AMS"){
      docRef = this.afs.collection("Degrees").doc("AMS"+ student.reqVersionSemester+ student.reqVersionYear);
      docRef.ref.get().then(val => {
        degreeReq = val.data();
      
        student.numCreditsNeededToGraduate = degreeReq.credits;

        if(track == "CAM"){  
          student.requiredCourses = degreeReq.requiredCoursesCAM;
        }
        else if(track == "CB"){
          student.requiredCourses = degreeReq.requiredCoursesCB;
        }
        else if(track == "OR"){
          student.requiredCourses = degreeReq.requiredCoursesOR;
        }
        else if(track == "STAT"){
          student.requiredCourses = degreeReq.requiredCoursesSTAT;
        }
        else{
          student.requiredCourses = degreeReq.requiredCoursesQF;
        }
        var temp = [];
        if(student.coursesTaken.length > 0){
          for (const c of student.requiredCourses) {
            for (const i of student.coursesTaken){
              if(!c.includes(i.toString())){
                temp.push(c);
              }
            }
          }
        }
        else{
          temp = student.requiredCourses
        }
        student.requiredCourses = temp;
        if(!student.hasRequiredCourses && student.requiredCourses.length == 0){
          student.hasRequiredCourses = true;
          student.satisfied += 1;
          if(student.validCoursePlan){
            student.pending -= 1;
          }
          else{
            student.unsatisfied -= 1;
          }
        }
        else if(student.hasRequiredCourses && student.requiredCourses.length != 0){
          student.hasRequiredCourses = false;
          student.satisfied -= 1;
          if(student.validCoursePlan){
            student.pending += 1;
          }
          else{
            student.unsatisfied += 1;
          }
        }
        else if(student.hasRequiredCourses && student.requiredCourses.length == 0){
          
        }
        else{
          student.hasRequiredCourses = false;
        }
        this.afs.firestore.collection('Students').doc(student.id).set(student);
      });
    }
    else if(dept == "BMI"){
      // var degreeReq: BMI;
      docRef = this.afs.collection("Degrees").doc("BMI"+ student.reqVersionSemester+ student.reqVersionYear);
      docRef.ref.get().then( val => {
        degreeReq = val.data();
        student.numCreditsNeededToGraduate = degreeReq.credits;
        if(track == "Imaging, Thesis"){
          var courses = degreeReq.requiredCourses.concat(degreeReq.requiredCoursesII);
          courses = courses.concat(degreeReq.requiredCourseThesis);
          student.requiredCourses = courses;
        }
        else if(track == "Imaging, Project"){
          var courses = degreeReq.requiredCourses.concat(degreeReq.requiredCoursesII);
          courses = courses.concat(degreeReq.requiredCourseProject);
          student.requiredCourses = courses;
        }
        else if(track == "Clinical, Thesis"){
          var courses = degreeReq.requiredCourses.concat(degreeReq.requriedCoursesCI);
          courses = courses.concat(degreeReq.requiredCourseThesis);
          student.requiredCourses = courses;

        }
        else if(track == "Clinical, Project"){
          var courses = degreeReq.requiredCourses.concat(degreeReq.requriedCoursesCI);
          courses = courses.concat(degreeReq.requiredCourseProject);
          student.requiredCourses = courses;

        }
        else if(track == "Translational, Thesis"){
          var courses = degreeReq.requiredCourses.concat(degreeReq.requiredCoursesTBI);
          courses = courses.concat(degreeReq.requiredCourseThesis);
          student.requiredCourses = courses;
        }
        else{
          var courses = degreeReq.requiredCourses.concat(degreeReq.requiredCoursesTBI);
          courses = courses.concat(degreeReq.requiredCourseProject);
          student.requiredCourses = courses;
        }
        var temp = [];
        if(student.coursesTaken.length > 0){
          for (const c of student.requiredCourses) {
            for (const i of student.coursesTaken){
              if(!c.includes(i.toString())){
                temp.push(c);
              }
            }
          }
        }
        else{
          temp = student.requiredCourses
        }
        student.requiredCourses = temp;
        if(!student.hasRequiredCourses && student.requiredCourses.length == 0){
          student.hasRequiredCourses = true;
          student.satisfied += 1;
          if(student.validCoursePlan){
            student.pending -= 1;
          }
          else{
            student.unsatisfied -= 1;
          }
        }
        else if(student.hasRequiredCourses && student.requiredCourses.length != 0){
          student.hasRequiredCourses = false;
          student.satisfied -= 1;
          if(student.validCoursePlan){
            student.pending += 1;
          }
          else{
            student.unsatisfied += 1;
          }
        }
        else if(student.hasRequiredCourses && student.requiredCourses.length == 0){
          
        }
        else{
          student.hasRequiredCourses = false;
        }
        this.afs.firestore.collection('Students').doc(student.id).set(student);
      });
    }
    else if(dept == "CSE"){
    
      docRef = this.afs.collection("Degrees").doc("CSE"+ student.reqVersionSemester+ student.reqVersionYear);
      docRef.ref.get().then( val => {
        degreeReq = val.data();
      
        student.numCreditsNeededToGraduate = degreeReq.credits;

        if(track == "Advanced Project"){
          student.requiredCourses = degreeReq.requiredCoursesA;

        }
        else if(track == "Special Project"){
          student.requiredCourses = degreeReq.requiredCoursesS;

        }
        else{
          student.requiredCourses = degreeReq.requiredCoursesT;
        }
        var temp = [];
        if(student.coursesTaken.length > 0){
          for (const c of student.requiredCourses) {
            for (const i of student.coursesTaken){
              if(!c.includes(i.toString())){
                temp.push(c);
              }
            }
          }
        }
        else{
          temp = student.requiredCourses
        }
        student.requiredCourses = temp;
        if(!student.hasRequiredCourses && student.requiredCourses.length == 0){
          student.hasRequiredCourses = true;
          student.satisfied += 1;
          if(student.validCoursePlan){
            student.pending -= 1;
          }
          else{
            student.unsatisfied -= 1;
          }
        }
        else if(student.hasRequiredCourses && student.requiredCourses.length != 0){
          student.hasRequiredCourses = false;
          student.satisfied -= 1;
          if(student.validCoursePlan){
            student.pending += 1;
          }
          else{
            student.unsatisfied += 1;
          }
        }
        else if(student.hasRequiredCourses && student.requiredCourses.length == 0){
          
        }
        else{
          student.hasRequiredCourses = false;
        }

        this.afs.firestore.collection('Students').doc(student.id).update(student);
      });
    }
    else{

      docRef = this.afs.collection("Degrees").doc("ECE"+ student.reqVersionSemester+ student.reqVersionYear);
      docRef.ref.get().then( val => {
        degreeReq = val.data();
        if(track == "Non-Thesis"){
          student.requiredCourses = degreeReq.requiredCoursesNT;
          student.numCreditsNeededToGraduate = degreeReq.creditMinimumNT;
        }
        else{
          student.requiredCourses = degreeReq.requiredCoursesT;
          student.numCreditsNeededToGraduate = degreeReq.creditMinimumT;
        }
        var temp = [];
        if(student.coursesTaken.length > 0){
          for (const c of student.requiredCourses) {
            for (const i of student.coursesTaken){
              if(!c.includes(i.toString())){
                temp.push(c);
              }
            }
          }
        }
        else{
          temp = student.requiredCourses
        }
        student.requiredCourses = temp;
        if(!student.hasRequiredCourses && student.requiredCourses.length == 0){
          student.hasRequiredCourses = true;
          student.satisfied += 1;
          if(student.validCoursePlan){
            student.pending -= 1;
          }
          else{
            student.unsatisfied -= 1;
          }
        }
        else if(student.hasRequiredCourses && student.requiredCourses.length != 0){
          student.hasRequiredCourses = false;
          student.satisfied -= 1;
          if(student.validCoursePlan){
            student.pending += 1;
          }
          else{
            student.unsatisfied += 1;
          }
        }
        else if(student.hasRequiredCourses && student.requiredCourses.length == 0){

        }
        else{
          student.hasRequiredCourses = false;
        }
        this.afs.firestore.collection('Students').doc(student.id).set(student);
      });
    }
  }
}
