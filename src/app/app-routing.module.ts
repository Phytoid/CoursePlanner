import { LoginComponent } from './components/login/login.component';
import { StudentComponent } from './components/student/student.component';
import {GpdComponent} from './components/gpd/gpd.component';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'student', component: StudentComponent },
  { path: 'gpd', component: GpdComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
