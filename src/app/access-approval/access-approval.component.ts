import { Component, OnInit, Inject } from '@angular/core';
import { MydataserviceService } from '../mydataservice.service';
import { Profile, ProfileObj } from '../profile';
import { BehaviorSubject, Observable } from 'rxjs';
import { AccessApprovalDialogComponent } from '../access-approval-dialog/access-approval-dialog.component';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSlideToggleChange } from '@angular/material';
import { switchMap, map, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-access-approval',
  templateUrl: './access-approval.component.html',
  styleUrls: ['./access-approval.component.css'],
  providers: [MydataserviceService]
})
export class AccessApprovalComponent implements OnInit {
  profile: Profile;
  myProfileList: Profile[] = [];
  page: number = 1;
  nextPage: number;
  hasNextPage: boolean = true;
  totalDocs: number;

  // Source data
  private _done = new BehaviorSubject(false);
  private _loading = new BehaviorSubject(false);

  // Observable data
  public done: Observable<boolean> = this._done.asObservable();
  public loading: Observable<boolean> = this._loading.asObservable();

  // slide toggle
  color = 'accent';
  checked = true;
  disabled = false;

  constructor(public service: MydataserviceService,
              public dialog: MatDialog,
              public snackBar: MatSnackBar) { }

  ngOnInit() {
    this._loading.next(true);
    this.getProfiles();

    // this.optionB.valueChanges.subscribe(checked => {
    //   if (checked) {
    //     this.optionBExtra.setValidators([Validators.required, Validators.minLength(5)]);
    //   } else {
    //     this.optionBExtra.setValidators(null);
    //   }
    //   this.optionBExtra.updateValueAndValidity();
    // });
  }

  toggle(event: MatSlideToggleChange) {
    this.service.newestFirst = event.checked;
    this._loading.next(true);
    this._done.next(false);
    this.myProfileList = [];
    this.page = 1;
    this.nextPage = 0;
    this.hasNextPage = true;
    this.getProfiles();
  }

  // docs {Array} - Array of documents
  // totalDocs {Number} - Total number of documents in collection that match a query
  // limit {Number} - Limit that was used
  // hasPrevPage {Bool} - Availability of prev page.
  // hasNextPage {Bool} - Availability of next page.
  // page {Number} - Current page number
  // totalPages {Number} - Total number of pages.
  // offset {Number} - Only if specified or default page/offset values were used
  // prevPage {Number} - Previous page number if available or NULL
  // nextPage {Number} - Next page number if available or NULL

  getProfiles() {
    if (this.hasNextPage === true) {

      // option 1
      // this.service.getProfiles(this.page).pipe(
      // map(params => params['id']),
      // switchMap(id => id ? id : Observable.empty())
      // .subscribe(user => this.user = user);
      // );

      // option 2
      // const result = this.service.getProfiles(this.page).pipe(
      //   map(res => res),
      //   switchMap(id => id ? id : empty())
      // );

      // option 3
      // const result = this.service.getProfiles(this.page)
      // .pipe(
      //   map((res: any) => res),
      //   switchMap((res: any) => res ? res : empty()))
      // .subscribe({
      //   next: (res: any) => {
      //     this.hasNextPage = res.hasNextPage;
      //     this.nextPage = res.nextPage;
      //     this.onProfileSuccess(res.docs);
      //   },
      //   complete: () => {
      //     this._done.next(true);
      //     this._loading.next(false);
      //   }
      // });

      this.service.getProfiles(this.page)
      .pipe( tap((res: any) => res) )
      .subscribe({
        next: (res: any) => {
          this.hasNextPage = res.hasNextPage;
          this.nextPage = res.nextPage;
          this.onProfileSuccess(res.docs);
        },
        complete: () => {
          if (this.hasNextPage === false) { this._done.next(true); }
          this._loading.next(false);
        }
      });

      // orig code
      // try if... res => res.length > 0
      // this.service.getProfiles(this.page).subscribe((res: any) => {
      //   this.hasNextPage = res.hasNextPage;
      //   this.nextPage = res.nextPage;
      //   this.onProfileSuccess(res.docs);
      //   // if (res.hasNextPage === false) {
      //   //   this._done.next(true);
      //   // }
      // });

    } else {
      this._done.next(true);
      this._loading.next(false);
    }
  }

  onProfileSuccess(res) {
    // console.log(res);
    if (res !== undefined) {
      // this.myPhotosList = [];
      res.forEach(item => {
        this.myProfileList.push(new ProfileObj(item));
      });
    }
  }

  onScroll() {
    this._loading.next(true);
    // console.log('scrolled');
    this.page = this.page + 1;
    this.getProfiles();
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

  openDialog(): void {
    const dialogRef = this.dialog.open(AccessApprovalDialogComponent, {
      // this should not be 700px and must implement css grid styling
      // width: '100%',
      width: 'calc(100%)',
      data: { profile: this.profile, action: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed ', result);
      this.profile = result.profile;
      // result.action here
      switch (result.action) {
        case 'Cancelled':
          break;
        case 'Send Request':
          // set accessaproval to Provisional
          this.profile.accessapproval = 'Provisional';
          // update db with this.profile
          this.saveProfile();
          break;
        case 'Endorse Access':
          // set accessaproval to Provisional
          this.profile.accessapproval = 'Provisional';
          // update db with this.profile
          this.saveProfile();
          break;
        case 'Deny Request':
          // set accessaproval to Denied
          this.profile.accessapproval = 'Denied';
          // update db with this.profile
          this.saveProfile();
          break;
        case 'Approve Request':
          // set access to proviaccess
          this.profile.access = this.profile.proviaccess;
          // set accessaproval to Approved
          this.profile.accessapproval = 'Approved';
          // update db with this.profile
          this.saveProfile();
          break;
        case '':
          break;
        default:
          break;
      }
    });
  }

  saveProfile(): void {
    this.service.saveProfile(this.profile)
    .pipe( tap((res: any) => res) )
    .subscribe({
      next: (res: any) => {
        this.snackBar.open('Success!', 'Profile updated.', {
          duration: 5000,
        });
      },
      complete: () => {
        // refresh infin8 list
        this.refreshInfin8List();
      }
    });
  }

  OnMatCardClickEvent(item: any): void {
    this.profile = <Profile>item;
    this.openDialog();
  }

  OnAccessTypeClickEvent(type: string): void {
    this.service.find = type;
    this.refreshInfin8List();
  }

  refreshInfin8List() {
    this._loading.next(true);
    this._done.next(false);
    this.myProfileList = [];
    this.page = 1;
    this.nextPage = 0;
    this.hasNextPage = true;
    this.getProfiles();
  }

}
