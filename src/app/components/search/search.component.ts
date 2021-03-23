import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { StudentService } from 'src/app/services/student.service';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements AfterViewInit {
  searchColumns: string[] = ['sbuID', 'lastName', 'firstName', 'dept', 'track', 'satisfied', 'pending', 'unsatisfied', 'gradSemester', 'gradYear', 'semesters', 'graduated']
  dataSource: MatTableDataSource<any>

  @ViewChild(MatSort) sort: MatSort;

  constructor(public studentService: StudentService) { }

  ngAfterViewInit(): void {
      this.studentService.getStudents().subscribe(s => {
      this.dataSource = new MatTableDataSource(s);
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(substring: string) {
    substring = substring.trim()
    substring = substring.toLowerCase();
    this.dataSource.filter = substring;
  }
}
