import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-gpd',
  templateUrl: './gpd.component.html',
  styleUrls: ['./gpd.component.css']
})
export class GpdComponent implements OnInit {

  constructor(private db: AngularFireDatabase) { }

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
}
