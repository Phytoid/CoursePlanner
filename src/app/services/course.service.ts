import { Courses } from './../models/courses';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { elementEventFullName } from '@angular/compiler/src/view_compiler/view_compiler';


@Injectable({
  providedIn: 'root'
})
export class CourseService {
  courses: Observable<Courses[]>;
  state: string = "hello";
  constructor(public afs: AngularFirestore) { 
    this.courses = this.afs.collection('CourseInfo', ref => ref.where('state', '==',this.state)).snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Courses;
        data.course = a.payload.doc.id;
        return data;
      })
    }))
  }

  getCoursesForSemester(semester: string, year: string){
    this.courses = this.afs.collection('CourseInfo', ref => ref.where('semester', '==',semester).where('year', '==', year)).snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Courses;
        data.course = a.payload.doc.id;
        return data;
      })
    }))
    return this.courses;
  }

  
  getCourses(){
    return this.courses;
  }

}
