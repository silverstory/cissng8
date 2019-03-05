import { Component, OnInit, Inject } from '@angular/core';
import { MydataserviceService } from '../mydataservice.service';
import { Profile, ProfileObj } from '../profile';
import { BehaviorSubject, Observable } from 'rxjs';
import { AccessApprovalDialogComponent } from '../access-approval-dialog/access-approval-dialog.component';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user';
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

  chips = [
    {name: 'OPEMPLOYEE'},
    {name: 'OPVISITOR'},
    {name: 'BRGYRESIDENT'}
  ];

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

  // for new approval workflow
  current_distinction = 'OPEMPLOYEE';
  current_approvalstatus = 'Provisional';
  // end for new approval workflow

  constructor(public service: MydataserviceService,
              public dialog: MatDialog,
              public snackBar: MatSnackBar,
              private authService: AuthService
              ) { }

  async ngOnInit() {
    this._loading.next(true);

    try {
      await this.authService.getProfile()
        .subscribe((user) => {
          this.service.usertype = user.usertype;
          this.getProfiles();
        });
    } catch (error) {
      this.authService.log(error);
    }
  }

  onDistinctionChipClick(chipname) {
    this.service.distinction = chipname;
    this.current_distinction = chipname;
    this.refreshInfin8List();
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


      this.service.getApprovalTemplate()
      .pipe(
        tap((res: any) => res)
      )
      .subscribe( template => {
        this.service.getProfiles(this.page)
        .pipe(
          tap((res: any) => res)
        )
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
      });


      // // old working march 2019
      // // this.service.getProfiles(this.page)
      // // .pipe(
      // // tap((res: any) => res)
      // // )
      // this.service.getApprovalTemplate()
      // .pipe(
      //   switchMap(profiles => this.service.getProfiles(this.page))
      // )
      // .subscribe({
      //   next: (res: any) => {
      //     this.hasNextPage = res.hasNextPage;
      //     this.nextPage = res.nextPage;
      //     this.onProfileSuccess(res.docs);
      //   },
      //   complete: () => {
      //     if (this.hasNextPage === false) { this._done.next(true); }
      //     this._loading.next(false);
      //   }
      // });

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
        this.myProfileList.push(this.createFreezedProfile(new ProfileObj(item)));
      });
    }
  }

  createFreezedProfile(p: Profile): Profile {

    // deconstruct then set to this.profile
    const {
      _id,
      profileid,
      mobile,
      email,
      name,
      distinction,
      personaccesslevel,
      recordstatus,
      cisscode,
      cissinqtext,
      cisstoken,
      photothumbnailurl,
      employee,
      resident,
      visitor,
      datecreated,
      dateupdated,
      two_factor_temp_secret,
      two_factor_secret,
      two_factor_enabled,
      score,
      access,
      proviaccess,
      gender,
      nextstep,
      accessapproval,
      accessdatetagged,
      blacklisted,
    } = p;

    const profile: Profile = <Profile> Object.freeze({
      _id: _id,
      profileid: profileid,
      mobile: mobile,
      email: email,
      name: Object.freeze({
        first: name.first,
        middle: name.middle,
        last: name.last
      }),
      distinction: distinction,
      personaccesslevel: personaccesslevel,
      recordstatus: recordstatus,
      cisscode: cisscode,
      cissinqtext: cissinqtext,
      cisstoken: cisstoken,
      photothumbnailurl: photothumbnailurl,
      employee: employee !== undefined ? Object.freeze({
        position: employee.position,
        office: employee.office
      }) : {},
      resident: resident !== undefined ? Object.freeze({
        city: resident.city,
        district: resident.district,
        barangay: resident.barangay
      }) : {},
      visitor: visitor !== undefined ? Object.freeze({
        visitorid: visitor.visitorid,
        visitorcompany: visitor.visitorcompany,
        persontovisit: visitor.persontovisit,
        visitorpurpose: visitor.visitorpurpose,
        visitordestination: visitor.visitordestination,
        timeofappointment: visitor.timeofappointment,
        visitstatus: visitor.visitstatus
      }) : {},
      datecreated: datecreated,
      dateupdated: dateupdated,
      two_factor_temp_secret: two_factor_temp_secret,
      two_factor_secret: two_factor_secret,
      two_factor_enabled: two_factor_enabled,
      score: score,
      access: Object.freeze({
        one: access.one,
        two: access.two,
        three: access.three,
        four: access.four,
        colorone: access.colorone,
        colortwo: access.colortwo,
        colorthree: access.colorthree,
        colorfour: access.colorfour
      }),
      proviaccess: Object.freeze({
        one: proviaccess.one,
        two: proviaccess.two,
        three: proviaccess.three,
        four: proviaccess.four,
        colorone: proviaccess.colorone,
        colortwo: proviaccess.colortwo,
        colorthree: proviaccess.colorthree,
        colorfour: proviaccess.colorfour
      }),
      gender: gender,
      nextstep: nextstep,
      accessapproval: accessapproval,
      accessdatetagged: accessdatetagged,
      blacklisted: blacklisted
    });
    return profile;
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
    const p: Profile = this.createFreezedProfile(this.profile);
    const dialogRef = this.dialog.open(AccessApprovalDialogComponent, {
      // this should not be 700px and must implement css grid styling
      // width: '100%',
      width: 'calc(100%)',
      data: {
        profile: this.profile,
        freezedProfile: p,
        action: ''
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed ', result);
      // result.action here
      switch (result.action) {
        case 'Cancelled':
        this.profile = p;
          break;
        case 'Send Request':
          // set accessaproval to Provisional
          this.profile = result.profile;
          this.profile.accessapproval = 'Provisional';
          // update db with this.profile
          this.saveProfile();
          break;
        case 'Endorse Access':
          // set accessaproval to Provisional
          this.profile = result.profile;
          this.profile.accessapproval = 'Provisional';
          // update db with this.profile
          this.saveProfile();
          break;
        case 'Deny Request':
          // set accessaproval to Denied
          this.profile = this.unfreezeProfile(p);
          this.profile.accessapproval = 'Denied';
          // update db with this.profile
          this.saveProfile();
          break;
        case 'Approve Request':
          // set access to proviaccess
          this.profile = result.profile;
          this.profile.access = this.profile.proviaccess;
          // set accessaproval to Approved
          this.profile.accessapproval = 'Approved';
          // update db with this.profile
          this.saveProfile();
          break;
        case '':
          this.profile = p;
          break;
        default:
        this.profile = p;
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
    this.current_approvalstatus = type;
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

  unfreezeProfile(p: Profile): Profile {

    // deconstruct then set to this.profile
    const {
      _id,
      profileid,
      mobile,
      email,
      name,
      distinction,
      personaccesslevel,
      recordstatus,
      cisscode,
      cissinqtext,
      cisstoken,
      photothumbnailurl,
      employee,
      resident,
      visitor,
      datecreated,
      dateupdated,
      two_factor_temp_secret,
      two_factor_secret,
      two_factor_enabled,
      score,
      access,
      proviaccess,
      gender,
      nextstep,
      accessapproval,
      accessdatetagged,
      blacklisted,
    } = p;

    const profile: Profile = <Profile> {
      _id: _id,
      profileid: profileid,
      mobile: mobile,
      email: email,
      name: {
        first: name.first,
        middle: name.middle,
        last: name.last
      },
      distinction: distinction,
      personaccesslevel: personaccesslevel,
      recordstatus: recordstatus,
      cisscode: cisscode,
      cissinqtext: cissinqtext,
      cisstoken: cisstoken,
      photothumbnailurl: photothumbnailurl,
      employee: employee !== undefined ? {
        position: employee.position,
        office: employee.office
      } : {},
      resident: resident !== undefined ? {
        city: resident.city,
        district: resident.district,
        barangay: resident.barangay
      } : {},
      visitor: visitor !== undefined ? {
        visitorid: visitor.visitorid,
        visitorcompany: visitor.visitorcompany,
        persontovisit: visitor.persontovisit,
        visitorpurpose: visitor.visitorpurpose,
        visitordestination: visitor.visitordestination,
        timeofappointment: visitor.timeofappointment,
        visitstatus: visitor.visitstatus
      } : {},
      datecreated: datecreated,
      dateupdated: dateupdated,
      two_factor_temp_secret: two_factor_temp_secret,
      two_factor_secret: two_factor_secret,
      two_factor_enabled: two_factor_enabled,
      score: score,
      access: {
        one: access.one,
        two: access.two,
        three: access.three,
        four: access.four,
        colorone: access.colorone,
        colortwo: access.colortwo,
        colorthree: access.colorthree,
        colorfour: access.colorfour
      },
      proviaccess: {
        one: proviaccess.one,
        two: proviaccess.two,
        three: proviaccess.three,
        four: proviaccess.four,
        colorone: proviaccess.colorone,
        colortwo: proviaccess.colortwo,
        colorthree: proviaccess.colorthree,
        colorfour: proviaccess.colorfour
      },
      gender: gender,
      nextstep: nextstep,
      accessapproval: accessapproval,
      accessdatetagged: accessdatetagged,
      blacklisted: blacklisted
    };
    return profile;
  }

}
