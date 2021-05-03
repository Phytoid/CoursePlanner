import { StudentRequirementsService } from './../../services/student-requirements.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { NgbDateStruct, NgbCalendar, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import bcrypt from 'bcryptjs';

import { Student } from '../../models/student';
import { ECE } from 'src/app/models/ece';
import { CSE } from 'src/app/models/cse';
import { BMI } from 'src/app/models/bmi';
import { AMS } from 'src/app/models/ams';


@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css']
})




export class AddStudentComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  error: string;
  s:Student;
  tracks:String[]
  dept: String
  model: NgbDateStruct;
  date: { year: number};
  @ViewChild('dp') dp: NgbDatepicker;

  constructor(private authService: AuthService, public router: Router, public afs: AngularFirestore, public sr: StudentRequirementsService) {
    if (!this.authService.isLoggedIn || localStorage.getItem('userType') != 'GPD') {
      this.router.navigate(['login'])
    }
  }

  ngOnInit(): void {
    this.dept=localStorage.getItem('gpdType');
  }

  addStudent(event) {
    var value = (2021 - parseInt(event.srcElement[10].value)) * 2;
    if (event.srcElement[7].value.toLocaleLowerCase() === "spring") {
      value = value + 1;
    }
    this.s = {
      first: event.srcElement[0].value,
      last: event.srcElement[1].value,
      id: event.srcElement[2].value,
      sbuID: event.srcElement[2].value,
      email: event.srcElement[3].value,
      dept: event.srcElement[5].value,
      track: event.srcElement[6].value,
      entrySemester: event.srcElement[7].value,
      entryYear: event.srcElement[10].value,
      reqVersionSemester: event.srcElement[12].value,
      reqVersionYear: event.srcElement[15].value,
      gradSemester: event.srcElement[17].value,
      gradYear: event.srcElement[20].value,
      advisor: event.srcElement[22].value,
      satisfied: 1,
      pending: 0,
      unsatisfied: 0,
      semesters: value,
      graduated: false,
      validCoursePlan: false,
      gpa: 0,
      credits: 0,
      requiredCourses: [],
      hasThesis: false, meetsCreditMinimum: false, electiveCredits: 0, isMeetTimeLimit: false, meetsElectiveCreditMinimum: false, meetsGPA: false,
      numCreditsNeededToGraduate: 0, coursesTaken: []
    }
    this.s.comments = [];
    this.s.comments.push(event.srcElement[22].value);
    if(this.s.dept == 'AMS'){
      this.s.unsatisfied = 4;
      this.s.electiveCredits = 0;
      this.s.isMeetTimeLimit = false;
      this.s.meetsElectiveCreditMinimum = false;
      this.s.numAmsStatCourses = 0;
      this.s.hasAmsFinalRec = false; 
      this.s.hasAmsORStatComplete = false;
    }
    else if(this.s.dept == 'BMI'){
      this.s.unsatisfied = 4;
      this.s.hasBMI592AllSemesters = false;
    }
    else if(this.s.dept == 'CSE'){
      this.s.unsatisfied = 6;
      this.s.numCseBasicCourses = 0; 
      this.s.hasCseBasicCourses = false; 
      this.s.hasCseTheoryCourse = false; 
      this.s.hasCseIISCourse = false;
      this.s.hasCseSystemsCourse = false;
      this.s.numCseIISCourses = 0;
      this.s.numCseSystemsCourses = 0;
      this.s.numCseTheoryCourses = 0;
      if(this.s.track == 'Special Project'){
        this.s.unsatisfied += 1;
      }
    }
    else{
      this.s.unsatisfied = 8;
      this.s.numEceCadCourse = 0; 
      this.s.numEceHardwareCourse = 0; 
      this.s.numEceTheoryCourse = 0; 
      this.s.numEceNetworkCourse = 0; 
      this.s.numEceRegularCredits = 0; 
      this.s.numEse599Credits = 0; 
      this.s.numEse597Credits = 0; 
      this.s.hasEce599Credits = false; 
      this.s.hasEce597Credits = false; 
      this.s.hasEceCadCourse = false; 
      this.s.hasEceHardwareCourse = false; 
      this.s.hasEceNetworkingCourse = false; 
      this.s.hasEceRegularCredits =false; 
      this.s.hasEceTheoryCourse = false;
    }

    console.log(this.s.dept + this.s.reqVersionSemester + this.s.reqVersionYear)
    var docRef = this.afs.collection("Degrees").doc(this.s.dept + this.s.reqVersionSemester + this.s.reqVersionYear);
    this.hashPassword(event.srcElement[4].value).then((hash) => {
      console.log(this.s);
      this.s.password = hash.toString();
      this.afs.firestore.collection('Students').doc(this.s.id).set(this.s);
      docRef.valueChanges().subscribe(val => {
        console.log(val);
        this.sr.setStudentRequirements(this.s, val);
        this.updateStudent(this.s.dept, this.s.reqVersionSemester, this.s.reqVersionYear)
      });
    });

    this.router.navigate(['search']);
  }

  getTrack(event){
    document.getElementById("track").style.display = "inline" 
    var dept = event.srcElement.value;
    if(dept == "BMI"){
      this.tracks = ["Imaging, Thesis", "Imaging, Project", "Clinical, Thesis", "Clinical, Project", "Translational, Thesis", "Translational, Project"];
    }
    else if(dept == "AMS"){
      this.tracks = ["CAM", "CB", "OR", "STAT", "QF"];
    }
    else if(dept == "CSE"){
      this.tracks = ["Advanced Project", "Special Project", "Thesis"]
    }
    else{
      this.tracks = ["Non-Thesis", "Thesis"]
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

  setThesis(){
    this.s.hasThesis = !this.s.hasThesis;
  }

  async updateStudent(dept, semester, y){
    var ams: AMS;
    var bmi: BMI;
    var cse: CSE;
    var ece: ECE;
    var year = y.toString();
    var listOfEffectedStudents = [];
    if(dept == "AMS"){
      this.afs.collection('Degrees').doc(dept + semester + year).ref.get().then( doc => {
        ams = doc.data();
  
        this.afs.collection('Students').ref.where("dept", '==', dept).where('reqVersionSemester', '==', semester).where('reqVersionYear', '==', year).get().then(s => {
     
          s.docs.forEach(st =>{
            var student: Student = st.data();
            this.sr.setStudentRequirements(st.data(), ams);
            var changed = false;
            if(student.meetsCreditMinimum && student.credits < ams.credits){
              student.meetsCreditMinimum = false;
              student.satisfied -= 1;
              student.unsatisfied += 1;
              changed = true;
            }
            else if(!student.meetsCreditMinimum && student.credits >= ams.credits){
              student.meetsCreditMinimum = true;
              student.satisfied += 1;
              student.unsatisfied -= 1;
              changed = true;
            }
            if(student.meetsGPA && student.gpa < ams.gpa){
              student.meetsGPA = false;
              student.satisfied -= 1;
              student.unsatisfied += 1;
              changed = true;
            }
            else if(!student.meetsGPA && student.credits >= ams.gpa){
              student.meetsGPA = true;
              student.satisfied += 1;
              student.unsatisfied -= 1;
              changed = true;
            }
            var numElectives;
            if(student.track == "CAM"){
              numElectives = ams.numElectiveCoursesCAM;
            }
            else if(student.track == "CB"){
              numElectives = ams.numElectiveCoursesCB;
            }
            else if(student.track == "OR"){
              numElectives = ams.numElectiveCoursesOR;
              if(student.hasAmsORStatComplete && student.numAmsStatCourses < ams.numStatisticCoursesOR){
                student.hasAmsORStatComplete = false;
                student.satisfied -= 1;
                student.unsatisfied += 1;
                changed = true;
              }
              else if(!student.hasAmsORStatComplete && student.numAmsStatCourses >= ams.numStatisticCoursesOR){
                student.hasAmsORStatComplete = true;
                student.satisfied += 1;
                student.unsatisfied -= 1;
                changed = true;
              }
            }
            else if(student.track == "STAT"){
              numElectives = ams.numElectiveCoursesSTAT;
            }
            else{
              numElectives = ams.numElectiveCoursesQF;
            }
            
            if(student.meetsElectiveCreditMinimum && student.electiveCredits < numElectives){
              student.meetsElectiveCreditMinimum = false;
              student.satisfied -= 1;
              student.unsatisfied += 1;
              changed = true;
            }
            else if(!student.meetsElectiveCreditMinimum && student.electiveCredits >= numElectives){
              student.meetsElectiveCreditMinimum = true;
              student.satisfied += 1;
              student.unsatisfied -= 1;
              changed = true;
            }
            
            if(student.hasRequiredCourses && student.requiredCourses.length > 0){
              student.hasRequiredCourses = false;
              student.satisfied -= 1;
              if(student.validCoursePlan){
                student.pending += 1;
              }
              else{
                student.unsatisfied += 1;
              }
              changed = true;
            }
            else if(!student.hasRequiredCourses && student.requiredCourses.length == 0){
              student.hasRequiredCourses = true;
              student.satisfied += 1;
              if(student.validCoursePlan){
                student.pending -= 1;
              }
              else{
                student.unsatisfied -= 1;
              }
              changed = true;
            }
            if(changed){
              this.afs.collection("Students").doc(student.id).update(student).then(()=>{
                this.sr.setStudentRequirements(student, cse);
              });
              listOfEffectedStudents.push(student);
            }
            else{
              this.sr.setStudentRequirements(student, cse);
            }
          }); 
          console.log(listOfEffectedStudents);
        });
      });
    }
    else if(dept == "BMI"){
      this.afs.collection('Degrees').doc(dept + semester + year).ref.get().then(doc => {
        bmi = doc.data() as BMI;
        this.afs.collection('Students').ref.where("dept", '==', dept).where('reqVersionSemester', '==', semester).where('reqVersionYear', '==', year).get().then(s => {
     
          s.docs.forEach(st =>{
            var student: Student = st.data();
            this.sr.setStudentRequirements(st.data(), bmi);
            var changed = false;
            if(student.meetsCreditMinimum && student.credits < bmi.credits){
              student.meetsCreditMinimum = false;
              student.satisfied -= 1;
              student.unsatisfied += 1;
              changed = true;
            }
            else if(!student.meetsCreditMinimum && student.credits >= bmi.credits){
              student.meetsCreditMinimum = true;
              student.satisfied += 1;
              student.unsatisfied -= 1;
              changed = true;
            }
            if(student.meetsGPA && student.gpa < bmi.gpa){
              student.meetsGPA = false;
              student.satisfied -= 1;
              student.unsatisfied += 1;
              changed = true;
            }
            else if(!student.meetsGPA && student.credits >= bmi.gpa){
              student.meetsGPA = true;
              student.satisfied += 1;
              student.unsatisfied -= 1;
              changed = true;
            }
            if(student.hasRequiredCourses && student.requiredCourses.length > 0){
              student.hasRequiredCourses = false;
              student.satisfied -= 1;
              if(student.validCoursePlan){
                student.pending += 1;
              }
              else{
                student.unsatisfied += 1;
              }
              changed = true;
            }
            else if(!student.hasRequiredCourses && student.requiredCourses.length == 0){
              student.hasRequiredCourses = true;
              student.satisfied += 1;
              if(student.validCoursePlan){
                student.pending -= 1;
              }
              else{
                student.unsatisfied -= 1;
              }
              changed = true;
            }
            if(changed){
              this.afs.collection("Students").doc(student.id).update(student).then(()=>{
                this.sr.setStudentRequirements(student, bmi);
              });
              listOfEffectedStudents.push(student);
            }
            else{
              this.sr.setStudentRequirements(student, bmi);
            }
          }); 
          console.log(listOfEffectedStudents);
        });
      });
    }
    else if(dept == "CSE"){
      this.afs.collection('Degrees').doc(dept + semester + year).ref.get().then( doc => {
        cse = doc.data() as CSE;
        this.afs.collection('Students').ref.where("dept", '==', dept).where('reqVersionSemester', '==', semester).where('reqVersionYear', '==', year).get().then(s => {
     
          s.docs.forEach(st =>{

            var student: Student = st.data();
            var changed = false;
            if(student.meetsCreditMinimum && student.credits < cse.credits){
              student.meetsCreditMinimum = false;
              student.satisfied -= 1;
              student.unsatisfied += 1;
              changed = true;
            }
            else if(!student.meetsCreditMinimum && student.credits >= cse.credits){
              student.meetsCreditMinimum = true;
              student.satisfied += 1;
              student.unsatisfied -= 1;
              changed = true;
            }
            if(student.meetsGPA && student.gpa < cse.gpa){
              student.meetsGPA = false;
              student.satisfied -= 1;
              student.unsatisfied += 1;
              changed = true;
            }
            else if(!student.meetsGPA && student.gpa >= cse.gpa){
              student.meetsGPA = true;
              student.satisfied += 1;
              student.unsatisfied -= 1;
              changed = true;
            }
            if(student.hasRequiredCourses && student.requiredCourses.length > 0){
              student.hasRequiredCourses = false;
              student.satisfied -= 1;
              if(student.validCoursePlan){
                student.pending += 1;
              }
              else{
                student.unsatisfied += 1;
              }
              changed = true;
            }
            else if(!student.hasRequiredCourses &&  student.requiredCourses.length == 0){
              student.hasRequiredCourses = true;
              student.satisfied += 1;
              if(student.validCoursePlan){
                student.pending -= 1;
              }
              else{
                student.unsatisfied -= 1;
              }
              changed = true;
            }
            if(student.hasCseIISCourse && student.numCseIISCourses < cse.numBreadthCourses){
              student.hasCseIISCourse = false;
              student.satisfied -= 1;
              student.unsatisfied += 1;
              changed = true;
            }
            else if(!student.hasCseIISCourse && student.numCseIISCourses >= cse.numBreadthCourses){
              student.hasCseIISCourse = true;
              student.satisfied += 1;
              student.unsatisfied -= 1;
              changed = true;
            }
            if(student.hasCseSystemsCourse && student.numCseSystemsCourses < cse.numBreadthCourses){
              student.hasCseSystemsCourse = false;
              student.satisfied -= 1;
              student.unsatisfied += 1;
              changed = true;
            }
            else if(!student.hasCseSystemsCourse &&  student.numCseSystemsCourses >= cse.numBreadthCourses){
              student.hasCseSystemsCourse = true;
              student.satisfied += 1;
              student.unsatisfied -= 1;
              changed = true;
            }
            if(student.hasCseTheoryCourse && student.numCseTheoryCourses < cse.numBreadthCourses){
              student.hasCseTheoryCourse = false;
              student.satisfied -= 1;
              student.unsatisfied += 1;
              changed = true;
            }
            else if(!student.hasCseTheoryCourse &&   student.numCseTheoryCourses >= cse.numBreadthCourses){
              student.hasCseTheoryCourse = true;
              student.satisfied += 1;
              student.unsatisfied -= 1;
              changed = true;
            }
            if(student.track == "Special Project" && student.hasCseBasicCourses && student.numCseBasicCourses < cse.minBasicProjectS){
              student.hasCseBasicCourses = false;
              student.satisfied -= 1;
              student.unsatisfied += 1;
              changed = true;
            }
            else if(student.track == "Special Project" && !student.hasCseBasicCourses &&   student.numCseBasicCourses >= cse.minBasicProjectS){
              student.hasCseBasicCourses = true;
              student.satisfied += 1;
              student.unsatisfied -= 1;
              changed = true;
            }
            if(changed){
              this.afs.collection("Students").doc(student.id).update(student).then(()=>{
                this.sr.setStudentRequirements(student, cse);
              });
              listOfEffectedStudents.push(student);
            }
            else{
              this.sr.setStudentRequirements(student, cse);
            }
          }); 
        });
      });
    }
    else{

      this.afs.collection('Degrees').doc(dept + semester + year).ref.get().then( async doc => {
        ece = doc.data() as ECE;
        this.afs.collection('Students').ref.where("dept", '==', dept).where('reqVersionSemester', '==', semester).where('reqVersionYear', '==', year).get().then(s => {
    
          s.docs.forEach(st =>{
            var student: Student = st.data();

            this.sr.setStudentRequirements(student, ece);
            var changed = false;
            if(student.track == "Thesis"){
              if(student.meetsCreditMinimum && student.credits < ece.creditMinimumT){
                student.meetsCreditMinimum = false;
                student.satisfied -= 1;
                student.unsatisfied += 1;
                changed = true;
              }
              else if(!student.meetsCreditMinimum &&   student.credits >= ece.creditMinimumT){
                student.meetsCreditMinimum = true;
                student.satisfied += 1;
                student.unsatisfied -= 1;
                changed = true;
              }
              
              if(student.meetsGPA && student.gpa < ece.gpaT){
                
                student.meetsGPA = false;
              
                student.satisfied -= 1;
                student.unsatisfied += 1;
                changed = true;
              }
              else if(!student.meetsGPA && student.credits >= ece.gpaT){
                student.meetsGPA = true;
                student.satisfied += 1;
                student.unsatisfied -= 1;
                changed = true;
              }
              if(student.hasEceHardwareCourse && student.numEceHardwareCourse < ece.numCreditsSubAreas1T){
                student.hasEceHardwareCourse = false;
                student.satisfied -= 1;
                student.unsatisfied += 1;
                changed = true;
              }
              else if(!student.hasEceHardwareCourse && student.numEceHardwareCourse >= ece.numCreditsSubAreas1T){
                student.hasEceHardwareCourse = true;
                student.satisfied += 1;
                student.unsatisfied -= 1;
                changed = true;
              }
              if(student.hasEceNetworkingCourse && student.numEceNetworkCourse < ece.numCreditsSubAreas1T){
                student.hasEceNetworkingCourse = false;
                student.satisfied -= 1;
                student.unsatisfied += 1;
                changed = true;
              }
              else if(!student.hasEceNetworkingCourse && student.numEceNetworkCourse >= ece.numCreditsSubAreas1T){
                student.hasEceNetworkingCourse = true;
                student.satisfied += 1;
                student.unsatisfied -= 1;
                changed = true;
              }
              if(student.hasEceCadCourse && student.numEceCadCourse < ece.numCreditsSubAreas1T){
                student.hasEceCadCourse = false;
                student.satisfied -= 1;
                student.unsatisfied += 1;
                changed = true;
              }
              else if(!student.hasEceCadCourse && student.numEceCadCourse >= ece.numCreditsSubAreas1T){
                student.hasEceCadCourse = true;
                student.satisfied += 1;
                student.unsatisfied -= 1;
                changed = true;
              }
              if(student.hasEceTheoryCourse && student.numEceTheoryCourse < ece.numCreditsSubAreas2T){
                student.hasEceTheoryCourse = false;
                student.satisfied -= 1;
                student.unsatisfied += 1;
                changed = true;
              }
              else if(!student.hasEceTheoryCourse && student.numEceTheoryCourse >= ece.numCreditsSubAreas2T){
                student.hasEceTheoryCourse = true;
                student.satisfied += 1;
                student.unsatisfied -= 1;
                changed = true;
              }
              if(student.hasEceRegularCredits && student.numEceRegularCredits < ece.numRegularCoursesT){
                student.hasEceRegularCredits = false;
                student.satisfied -= 1;
                student.unsatisfied += 1;
                changed = true;
              }
              else if(!student.hasEceRegularCredits && student.numEceRegularCredits >= ece.numRegularCoursesT){
                student.hasEceRegularCredits = true;
                student.satisfied += 1;
                student.unsatisfied -= 1;
                changed = true;
              }
              if(student.hasEce597Credits && student.numEse597Credits < ece.minCreditsESE597T){
                student.hasEce597Credits = false;
                student.satisfied -= 1;
                student.unsatisfied += 1;
                changed = true;
              }
              else if(!student.hasEce597Credits && student.numEse597Credits >= ece.minCreditsESE597T){
                student.hasEce597Credits = true;
                student.satisfied += 1;
                student.unsatisfied -= 1;
                changed = true;
              }
              if(student.hasEce599Credits && student.numEse599Credits < ece.minCreditsESE599T){
                student.hasEceHardwareCourse = false;
                student.satisfied -= 1;
                student.unsatisfied += 1;
                changed = true;
              }
              else if(!student.hasEce599Credits && student.numEse599Credits >= ece.minCreditsESE599T){
                student.hasEce599Credits = true;
                student.satisfied += 1;
                student.unsatisfied -= 1;
                changed = true;
              }
              if(changed){
                this.afs.collection("Students").doc(student.id).update(student).then(()=>{
                  this.sr.setStudentRequirements(student, ece);
                });
                listOfEffectedStudents.push(student);
              }
              else{
                this.sr.setStudentRequirements(student, ece);
              }
            }
            else{
              if(student.meetsCreditMinimum && student.credits < ece.creditMinimumNT){
                student.meetsCreditMinimum = false;
                student.satisfied -= 1;
                student.unsatisfied += 1;
                changed = true;
                
              }
              else if(!student.meetsCreditMinimum &&   student.credits >= ece.creditMinimumNT){
                student.meetsCreditMinimum = true;
                student.satisfied += 1;
                student.unsatisfied -= 1;
                changed = true;
              }
              if(student.meetsGPA && student.gpa < ece.gpaNT){
                student.meetsGPA = false;
                student.satisfied -= 1;
                student.unsatisfied += 1;
                changed = true;
              }
              else if(!student.meetsGPA && student.credits >= ece.gpaNT){
                student.meetsGPA = true;
                student.satisfied += 1;
                student.unsatisfied -= 1;
                changed = true;
              }
              if(student.hasEceHardwareCourse && student.numEceHardwareCourse < ece.numCreditsSubAreas1NT){
                student.hasEceHardwareCourse = false;
                student.satisfied -= 1;
                student.unsatisfied += 1;
                changed = true;
              }
              else if(!student.hasEceHardwareCourse && student.numEceHardwareCourse >= ece.numCreditsSubAreas1NT){
                student.hasEceHardwareCourse = true;
                student.satisfied += 1;
                student.unsatisfied -= 1;
                changed = true;
              }
              if(student.hasEceNetworkingCourse && student.numEceNetworkCourse < ece.numCreditsSubAreas1NT){
                student.hasEceNetworkingCourse = false;
                student.satisfied -= 1;
                student.unsatisfied += 1;
                changed = true;
              }
              else if(!student.hasEceNetworkingCourse && student.numEceNetworkCourse >= ece.numCreditsSubAreas1NT){
                student.hasEceNetworkingCourse = true;
                student.satisfied += 1;
                student.unsatisfied -= 1;
                changed = true;
              }
              if(student.hasEceCadCourse && student.numEceCadCourse < ece.numCreditsSubAreas1NT){
                student.hasEceCadCourse = false;
                student.satisfied -= 1;
                student.unsatisfied += 1;
                changed = true;
              }
              else if(!student.hasEceCadCourse && student.numEceCadCourse >= ece.numCreditsSubAreas1NT){
                student.hasEceCadCourse = true;
                student.satisfied += 1;
                student.unsatisfied -= 1;
                changed = true;
              }
              if(student.hasEceTheoryCourse && student.numEceTheoryCourse < ece.numCreditsSubAreas2NT){
                student.hasEceTheoryCourse = false;
                student.satisfied -= 1;
                student.unsatisfied += 1;
                changed = true;
              }
              else if(!student.hasEceTheoryCourse && student.numEceTheoryCourse >= ece.numCreditsSubAreas2NT){
                student.hasEceTheoryCourse = true;
                student.satisfied += 1;
                student.unsatisfied -= 1;
                changed = true;
              }
              if(student.hasEceRegularCredits && student.numEceRegularCredits < ece.numRegularCoursesNT){
                student.hasEceRegularCredits = false;
                student.satisfied -= 1;
                student.unsatisfied += 1;
                changed = true;
              }
              else if(!student.hasEceRegularCredits && student.numEceRegularCredits >= ece.numRegularCoursesNT){
                student.hasEceRegularCredits = true;
                student.satisfied += 1;
                student.unsatisfied -= 1;
                changed = true;
              }
              if(student.hasEce597Credits && student.numEse597Credits < ece.minCreditsESE597NT){
                student.hasEce597Credits = false;
                student.satisfied -= 1;
                student.unsatisfied += 1;
                changed = true;
              }
              else if(!student.hasEce597Credits && student.numEse597Credits >= ece.minCreditsESE597NT){
                student.hasEce597Credits = true;
                student.satisfied += 1;
                student.unsatisfied -= 1;
                changed = true;
              }
              if(changed){
                this.afs.collection("Students").doc(student.id).update(student).then(()=>{
                  this.sr.setStudentRequirements(student, ece);
                });
                listOfEffectedStudents.push(student);
              }
              else{
                this.sr.setStudentRequirements(student, ece);
              }
            }
          });
        });  
      });
    };
  }

}

