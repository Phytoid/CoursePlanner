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

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule  } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field'
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from "@angular/fire/auth";
import { environment } from '../environments/environment';
import { CourseInfoComponent } from './components/course-info/course-info.component';
import { EnrollmentTrendsComponent } from './components/enrollment-trends/enrollment-trends.component';
import { DegreeReqsComponent } from './components/degree-reqs/degree-reqs.component';


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
    DegreeReqsComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
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
