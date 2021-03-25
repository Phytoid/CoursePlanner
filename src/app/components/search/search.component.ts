import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { StudentService } from 'src/app/services/student.service';
import { NgbDateStruct, NgbCalendar, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements AfterViewInit {
  filterDictionary = {nameFilter: "", graduationYear: "", graduationSemester: "", coursePlanCompleteness: "", coursePlanValidity: ""};
  searchColumns: string[] = ['sbuID', 'lastName', 'firstName', 'dept', 'track', 'coursePlan', 'satisfied', 'pending', 'unsatisfied', 'validCoursePlan', 'gradSemester', 'gradYear', 'semesters', 'graduated']
  dataSource: MatTableDataSource<any>
  @ViewChild(MatSort) sort: MatSort;

  model: NgbDateStruct;
  date: {year: number};
  @ViewChild('dp') dp: NgbDatepicker;

  constructor(private authService: AuthService, public studentService: StudentService, private calendar: NgbCalendar, public router: Router) { 
    if (!this.authService.isLoggedIn || localStorage.getItem('userType') != 'GPD') {
      this.router.navigate(['login'])
    }
  }

  ngAfterViewInit(): void {
    var gpd = 'ESE';
    if(localStorage.getItem('gpdType') == 'AMS'){
      gpd = 'AMS';
    }
    else if(localStorage.getItem('gpdType') == 'CSE'){
      gpd = 'CSE';
    }
    else if(localStorage.getItem('gpdType') == 'BMI'){
      gpd = 'BMI';
    }
    this.studentService.getStudents().subscribe(s => {
      var arr: any = []
      s.forEach(element => {
        if(element.dept == gpd){
          arr.push(element);
        }  
      });
      s = arr;
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

  semSelect(semester: string){
    if (semester !== "All") {
      semester = semester.trim().toLowerCase();
      this.filterDictionary.graduationSemester = semester;
    } else {
      this.filterDictionary.graduationSemester = "";
    }
    this.finalFilter();
  }

  completenessSelect(comp: string){
    if (comp !== "All") {
      comp = comp.trim().toLowerCase();
      this.filterDictionary.coursePlanCompleteness = comp;
    } else {
      this.filterDictionary.coursePlanCompleteness = "";
    }
    this.finalFilter();
  }

  changeDate(date: string) {
    date = date.trim().toLowerCase();
    this.filterDictionary.graduationYear = date;
    this.finalFilter();
  }

  applyFilter(substring: string) {
    if (substring !== "") {
      substring = substring.trim().toLowerCase();
      this.filterDictionary.nameFilter = substring;
    } else {
      this.filterDictionary.nameFilter = "";
    }
    this.finalFilter();
  }

  validitySelect(validity: string){
    if (validity !== "All") {
      validity = validity.trim().toLowerCase();
      this.filterDictionary.coursePlanValidity = validity;
    } else {
      this.filterDictionary.coursePlanValidity = "";
    }
    this.finalFilter();
  }

  public getColor(val: boolean): string{
    return val === true ? "green" : "darkred";
  }

  customFilterPredicate() {
    let nf = this.filterDictionary.nameFilter;
    let gs = this.filterDictionary.graduationSemester;
    let gy = this.filterDictionary.graduationYear;
    let cc = this.filterDictionary.coursePlanCompleteness;
    let cv = this.filterDictionary.coursePlanValidity;
    const myFilterPredicate = this.dataSource.filterPredicate = function(data): boolean {
      if (nf !== "") {
        if ((data.last.toLowerCase().includes(nf) || data.first.toLowerCase().includes(nf)) == false) {
          return false;
        }
      }
      if (gs !== "") {
        if (data.gradSemester.toLowerCase().includes(gs) == false) {
          return false;
        }
      }
      if (gy !== "") {
        if (data.gradYear.toLowerCase().includes(gy) == false) {
          return false;
        }
      }
      if (cv !== "") {
        if (cv.toLowerCase() === "coursevalid") {
          if (data.validCoursePlan === false) {
            return false;
          }
        } else {
          if (data.validCoursePlan === true) {
            return false;
          }
        }
      }
      if (cc !== "") {
        if (cc.toLowerCase() === "complete") {
          if (data.unsatisfied !== 0) {
            return false;
          }
        } else {
          if (data.unsatisfied === 0) {
            return false;
          }
        }
      }
      return true;
    };
    return myFilterPredicate;
  }
  
  finalFilter(){
    this.dataSource.filterPredicate = this.customFilterPredicate();
    this.dataSource.filter = JSON.stringify(this.filterDictionary); 
  }

  logout() {
    this.authService.logout()
  }
}
