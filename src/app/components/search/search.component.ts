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
  searchColumns: string[] = ['sbuID', 'lastName', 'firstName', 'dept', 'track', 'coursePlan', 'satisfied', 'pending', 'unsatisfied', 'gradSemester', 'gradYear', 'semesters', 'graduated']
  dataSource: MatTableDataSource<any>

  @ViewChild(MatSort) sort: MatSort;

  constructor(public studentService: StudentService) { }

  ngAfterViewInit(): void {
      this.studentService.getStudents().subscribe(s => {
      this.dataSource = new MatTableDataSource(s);
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = function(data, substring: string): boolean {
        return data.last.toLowerCase().includes(substring) || data.first.toLowerCase().includes(substring);
      };
      this.dataSource.sortingDataAccessor = (data: any, word: string): string => {
        if (word === 'lastName') {
          word = 'last'
        }
        if (word === 'firstName') {
          word = 'first'
        }
        if (typeof data[word] === 'string') { // Only run this function if string or error
          return data[word].toLowerCase();
        }
        return data[word]; // Just return if not a string
      };
    });
  }

  applyFilter(substring: string) {
    substring = substring.trim()
    substring = substring.toLowerCase();
    this.dataSource.filter = substring;
  }
}
