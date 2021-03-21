import {GpdComponent} from './components/gpd/gpd.component';
import { AddStudentComponent } from './components/add-student/add-student.component';
import { SearchComponent } from './components/search/search.component';
import { LoginComponent } from './components/login/login.component';
import { StudentComponent } from './components/student/student.component';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseInfoComponent } from './components/course-info/course-info.component';
import { EnrollmentTrendsComponent } from './components/enrollment-trends/enrollment-trends.component'

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'student', component: StudentComponent },
  { path: 'search', component: SearchComponent },
  { path: 'addStudent', component: AddStudentComponent },
  { path: 'gpd', component: GpdComponent },
  { path: 'login', component: LoginComponent},
  { path: 'courseInfo', component: CourseInfoComponent},
  { path: 'enrollmentTrends', component: EnrollmentTrendsComponent},
  { path: 'login', component: LoginComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
