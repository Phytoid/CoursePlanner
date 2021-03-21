import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { StudentComponent } from './components/student/student.component';
import { GpdComponent } from './components/gpd/gpd.component';
import { SearchComponent } from './components/search/search.component';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddStudentComponent } from './components/add-student/add-student.component';
import { StudentService } from './services/student.service'

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from "@angular/fire/auth";
import { environment } from '../environments/environment';
import { CourseInfoComponent } from './components/course-info/course-info.component';
import { EnrollmentTrendsComponent } from './components/enrollment-trends/enrollment-trends.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    StudentComponent,
    GpdComponent,
    SearchComponent,
    AddStudentComponent,
    CourseInfoComponent,
    EnrollmentTrendsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatCheckboxModule,
    MatSelectModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule
  ],
  providers: [StudentService],
  bootstrap: [AppComponent]
})
export class AppModule { }
