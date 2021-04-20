import { Courses } from './../models/courses';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CourseService {
  courses: Observable<Courses[]>;

  constructor(public afs: AngularFirestore) { 
    this.courses = this.afs.collection('Courses').snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Courses;
        data.course = a.payload.doc.id;
        return data;
      })
    }))
  }

  getCourses(){
    return this.courses;
  }

}
