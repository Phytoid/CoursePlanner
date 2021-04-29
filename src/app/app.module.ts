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
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddStudentComponent } from './components/add-student/add-student.component';
import { StudentService } from './services/student.service'

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule  } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AngularFireModule } from '@angular/fire';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from "@angular/fire/auth";
import { environment } from '../environments/environment';
import { CourseInfoComponent } from './components/course-info/course-info.component';
import { EnrollmentTrendsComponent } from './components/enrollment-trends/enrollment-trends.component';
import { DegreeReqsComponent } from './components/degree-reqs/degree-reqs.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SuggestCoursePlanComponent } from './components/suggest-course-plan/suggest-course-plan.component';

import { ViewStudentComponent } from './components/view-student/view-student.component';
import { MatCardModule } from '@angular/material/card';
import { CourseDialogComponent } from './components/course-dialog/course-dialog.component';
import { NgxPaginationModule} from 'ngx-pagination'

import { CommonModule } from '@angular/common';
import { PlotlyModule } from 'angular-plotly.js';
import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import { SemesterDialogComponent } from './components/semester-dialog/semester-dialog.component';
import { ViewCoursePlanComponent } from './view-course-plan/view-course-plan.component';


PlotlyModule.plotlyjs = PlotlyJS;

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
    SuggestCoursePlanComponent,
    ViewStudentComponent,
    CourseDialogComponent,
    SemesterDialogComponent,
    ViewCoursePlanComponent,
  ],
  imports: [
    MatCardModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule, 
    MatRippleModule,
    MatCheckboxModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    MatDialogModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    NgbModule,
    NgxPaginationModule,
    CommonModule,
    PlotlyModule
  ],
  entryComponents:[CourseDialogComponent],
  providers: [StudentService],
  bootstrap: [AppComponent]
})
export class AppModule { }
