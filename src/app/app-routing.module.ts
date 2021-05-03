import { ViewStudentComponent } from './components/view-student/view-student.component';
import {GpdComponent} from './components/gpd/gpd.component';
import { AddStudentComponent } from './components/add-student/add-student.component';
import { SearchComponent } from './components/search/search.component';
import { LoginComponent } from './components/login/login.component';
import { StudentComponent } from './components/student/student.component';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseInfoComponent } from './components/course-info/course-info.component';
import { EnrollmentTrendsComponent } from './components/enrollment-trends/enrollment-trends.component'
import { DegreeReqsComponent } from './components/degree-reqs/degree-reqs.component'
import { SuggestCoursePlanComponent } from './components/suggest-course-plan/suggest-course-plan.component';
import { ViewCoursePlanComponent } from './components/view-course-plan/view-course-plan.component';



const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'student', component: StudentComponent },
  { path: 'search', component: SearchComponent },
  { path: 'addStudent', component: AddStudentComponent },
  { path: 'gpd', component: GpdComponent },
  { path: 'login', component: LoginComponent},
  { path: 'courseInfo', component: CourseInfoComponent},
  { path: 'enrollmentTrends', component: EnrollmentTrendsComponent},
  { path: 'degreeReqs', component: DegreeReqsComponent},
  { path: 'suggestCoursePlan', component: SuggestCoursePlanComponent},
  { path: 'viewStudent', component: ViewStudentComponent},
  { path: 'viewCoursePlan', component: ViewCoursePlanComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
