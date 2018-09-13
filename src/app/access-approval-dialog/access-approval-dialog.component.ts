import { Component, OnInit, Inject } from '@angular/core';
// import { MydataserviceService } from '../mydataservice.service';
import { Profile, ProfileObj } from '../profile';
import { BehaviorSubject, Observable } from 'rxjs';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface DialogData {
  profile: Profile;
}

// PSG-GATE-OFFICER
// PSG-DATA-OFFICER
// HRMO-DATA-OFFICER
// PSG-CISS-MANAGER

@Component({
  selector: 'app-access-approval-dialog',
  templateUrl: './access-approval-dialog.component.html',
  styleUrls: ['./access-approval-dialog.component.css']
})
export class AccessApprovalDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AccessApprovalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getAccess(one, two, three, four): string {
    const a = ['', one, two, three, four];
    let access: string;
    access = '';
    for (let i = 1; i < 5; i++) {
      access = access + this.getCode(a[i], i.toString());
    }
    return access;
  }

  getCode(value, code): string {
    switch (value) {
      case 'notSelected':
        return '';
        case 'selected':
        return `Code ${code} ` ;
      }
  }

  // tiles

  getTileColor(tile) {
    switch (tile) {
      case 'One':
        return 'lightblue';
        case 'Two':
        return 'lightgreen';
        case 'Three':
        return '#DDBDF1';
        case 'Four':
        return '#DDBDF1';
      }
  }

  getTileAccess(access, tile) {
    switch (access) {
      case 'selected':
        return this.getTileColor(tile);
      case 'notSelected':
        return '#BDBDBD';
      default:
        return '#BDBDBD';
    }
  }

  // GET BACKGROUND COLOR

  getColor(status) {
    switch (status) {
      case 'ACTIVE':
        return '#1B5E20';
      case 'INACTIVE':
        return '#E91E63';
      default:
        return '#E8EAF6';
    }
  }

  ngOnInit() { }

}
