import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
// import { StudentService} from '../../services/student.service';
import { Student } from '../../models/student';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  // filters = new FormControl();
  // filtersList: string[] = ["Course Plan Validity", "Course Plan Completeness", "Graduation Semester", "Graduation Year"];
  //students: Student[];

  //constructor(private studentService: StudentService) { }
  constructor() { }
  ngOnInit(): void {
    // this.studentService.getStudents().subscribe(students => {
    //   this.students = students;
    // })
  }


}
