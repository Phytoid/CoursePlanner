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
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from '../environments/environment';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    StudentComponent,
    GpdComponent,
    SearchComponent,
    AddStudentComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
<<<<<<< HEAD
    ReactiveFormsModule,
    FormsModule,
    MatCheckboxModule,
=======
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule
>>>>>>> 3712de869d8f2cc1d650e9b669db29ce875e2d92
  ],
  providers: [StudentService],
  bootstrap: [AppComponent]
})
export class AppModule { }
