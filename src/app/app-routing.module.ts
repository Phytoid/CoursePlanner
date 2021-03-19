import {GpdComponent} from './components/gpd/gpd.component';
import { AddStudentComponent } from './components/add-student/add-student.component';
import { SearchComponent } from './components/search/search.component';
import { LoginComponent } from './components/login/login.component';
import { StudentComponent } from './components/student/student.component';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'student', component: StudentComponent },
  { path: 'search', component: SearchComponent },
  { path: 'addStudent', component: AddStudentComponent },
  { path: 'gpd', component: GpdComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
