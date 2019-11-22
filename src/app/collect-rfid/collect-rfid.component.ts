import { Component, OnInit, Inject } from '@angular/core';
import { MydataserviceService } from '../mydataservice.service';
import { Profile, ProfileObj } from '../profile';
import { Approvaltemplate, ApprovaltemplateObj } from '../approvaltemplate';
import { BehaviorSubject, Observable } from 'rxjs';
import { RequestFormDialogComponent } from '../request-form-dialog/request-form-dialog.component';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user';

import { switchMap, map, tap } from 'rxjs/operators';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatRadioChange, MatSlideToggleChange } from '@angular/material';

export interface DialogData {
  profile: Profile;
  freezedProfile: Profile;
  action: string;
  usertemplate: Approvaltemplate;
}

@Component({
  selector: 'app-collect-rfid',
  templateUrl: './collect-rfid.component.html',
  styleUrls: ['./collect-rfid.component.css']
})
export class CollectRfidComponent implements OnInit {

  // public user: User;

  public today = new Date();

  // profile: Profile;

  public face_icons = [
    'OPEMPLOYEE',
    'BRGYRESIDENT-PSG',
    'OPVISITOR-PRRD-GUEST',
    'OPVISITOR-VIP',
    'OPVISITOR-GENERAL-GUEST',
    'BRGYRESIDENT',
    'BRGYRESIDENT-RTVM',
    'OPVISITOR',
    'OPVISITOR-SECURITY-CLEARANCE',
    'OPEMPLOYEE-VIP',
    'OPVISITOR-VIP'
  ];

  constructor(public service: MydataserviceService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CollectRfidComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private authService: AuthService) { }

  async ngOnInit() {
    // this.profile = this.data.freezedProfile;
    // try {
    //   this.data.profile = new ProfileObj(this.service.unfreezeProfile(this.data.profile));
    //   this.authService.getProfile()
    //     .subscribe((user) => {
    //       this.user = user;
    //     });
    // } catch (error) {
    //   this.authService.log(error);
    // }
  }

  onButtonClick(action) {
    this.data.action = action;
  }

  onNoClick(): void {
    this.data.action = 'Cancelled';
    this.dialogRef.close();
  }

  setFaceIcon(distinction: String, gender: String): String {
    let icon: String = 'DEFAULT_' + gender.toUpperCase();
    const found = this.face_icons.find(element => element === distinction);
    if (found === undefined) {
      icon = 'DEFAULT_' + gender.toUpperCase();
    } else {
      icon = distinction + '_' + gender.toUpperCase();
    }
    return icon;
  }

}
