import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Student } from '../models/student';


@Injectable({
  providedIn: 'root'
})
export class StudentService {
  studentsCollection: AngularFirestoreCollection<Student>
  students: Observable<Student[]>;

  constructor(public afs: AngularFirestore) { 
    this.students = this.afs.collection('Students').snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Student;
        data.id = a.payload.doc.id;
        return data;
      })
    }))
    //this.studentsCollection = this.afs.collection('Students');
    // this.students = this.afs.collection('Students').snapshotChanges().map(changes => {
    //   return changes.map(a => {
    //     const data = a.payload.doc.data() as Student;
    //     data.id = a.payload.doc.id;
    //     return data;
    //   })
    // });
  }

  getStudents(){
    return this.students;
  }

}
