import { SemesterDialogData } from './../gpd/gpd.component';
import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-semester-dialog',
  templateUrl: './semester-dialog.component.html',
  styleUrls: ['./semester-dialog.component.css']
})
export class SemesterDialogComponent{

  constructor(public dialogRef: MatDialogRef<SemesterDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: SemesterDialogData) {

  }


  onNoClick(): void {
    this.dialogRef.close();
  }

}
