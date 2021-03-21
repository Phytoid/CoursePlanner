import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from  "@angular/router";
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-gpd',
  templateUrl: './gpd.component.html',
  styleUrls: ['./gpd.component.css']
})
export class GpdComponent implements OnInit {

  constructor(private authService: AuthService, public router: Router, private db: AngularFireDatabase) {
    if (this.authService.isLoggedIn == false) {
      this.router.navigate(['login'])
    }
  }

  ngOnInit(): void {
  }

  onDelete(){
    if(confirm("Are you sure you want to delete all students?")){
      this.db.database.ref().child("Persons").child("Students").on('value', (shapshot) => {
        shapshot.forEach((child) => {
           
            //console.log(child.val())
            if(child.ref.remove()){
              console.log("Delete");
            };
        })
      })
    }
  }

  logout() {
    this.authService.logout()
  }
}
