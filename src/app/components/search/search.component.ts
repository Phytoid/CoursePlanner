import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { StudentService } from 'src/app/services/student.service';
import { NgbDateStruct, NgbCalendar, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements AfterViewInit {
  searchColumns: string[] = ['sbuID', 'lastName', 'firstName', 'dept', 'track', 'coursePlan', 'satisfied', 'pending', 'unsatisfied', 'validCoursePlan', 'gradSemester', 'gradYear', 'semesters', 'graduated']
  dataSource: MatTableDataSource<any>
  @ViewChild(MatSort) sort: MatSort;

  model: NgbDateStruct;
  date: { year: number};
  @ViewChild('dp') dp: NgbDatepicker;

  constructor(private authService: AuthService, public studentService: StudentService, private calendar: NgbCalendar, public router: Router) { 
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['login'])
    }
  }

  ngAfterViewInit(): void {
      this.studentService.getStudents().subscribe(s => {
      this.dataSource = new MatTableDataSource(s);
      this.dataSource.sort = this.sort;
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

  deptChange(event){
    console.log(event.source.value, event.source.selected);
  }

  semSelect(semester: string){
    if(semester==="All") this.clearFilter();
    else{
    semester = semester.trim().toLowerCase();
    this.dataSource.filterPredicate = function(data, substring: string): boolean {
      return data.gradSemester.toLowerCase().includes(substring);
    };
    this.dataSource.filter = semester;}
  }

  deptSelect(dept: string){
    if(dept=="All") this.clearFilter();
    else{
    dept = dept.trim().toLowerCase();
    this.dataSource.filterPredicate = function(data, substring: string): boolean {
      return data.dept.toLowerCase().includes(substring);
    };
    this.dataSource.filter = dept;}
  }

  completenessChange(comp: string){
    var num;
    //console.log(comp)
    if(comp=="All") this.clearFilter();
    else{
    comp = comp.trim().toLowerCase();
    if (comp === "incomplete"){
      //if incomplete is selected, then unsatisfied and pending courses are not 0, so we can filter those out
      num = "0";
      this.dataSource.filterPredicate = function(data, substring: string): boolean {
        return data.unsatisfied && data.pending;
      };
      this.dataSource.filter = num;}
    }
    if (comp === "complete"){
      // if complete is selected, we want pending and unsatisfied equal 0
      this.dataSource.filterPredicate = function(data, substring: string): boolean {
        return data.unsatisfied == 0 || data.pending ==  0;
      };
      // data already filtered, use any value except for ''
      this.dataSource.filter = '1';}
  }

  applyFilter(substring: string) {
    substring = substring.trim()
    substring = substring.toLowerCase();
    this.dataSource.filterPredicate = function(data, substring: string): boolean {
      return data.last.toLowerCase().includes(substring) || data.first.toLowerCase().includes(substring);
    };
    this.dataSource.filter = substring;
  }

  changeDate(year: string) {
    //console.log(event);
    year = year.trim().toLowerCase();
    this.dataSource.filterPredicate = function(data, substring: string): boolean {
      return data.gradYear.toLowerCase().includes(substring);
    };
    this.dataSource.filter = year;
  }

  public getColor(val: boolean): string{
    return val === true ? "green" : "darkred";
  }
  
  clearFilter(){
    //console.log("cleared")
    this.dataSource.filter = '';
    return;
  }

  logout() {
    this.authService.logout()
  }
}
