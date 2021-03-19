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
    this.students = this.afs.collection('students').valueChanges();
  }

  getStudents(){
    return this.students;
  }
}
