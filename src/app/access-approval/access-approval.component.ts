import { Component, OnInit, Inject } from '@angular/core';
import { MydataserviceService } from '../mydataservice.service';
import { Profile, ProfileObj } from '../profile';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { AccessApprovalDialogComponent } from '../access-approval-dialog/access-approval-dialog.component';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSlideToggleChange } from '@angular/material';
import { switchMap, map, tap, mergeMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { template } from '@angular/core/src/render3';

@Component({
  selector: 'app-access-approval',
  templateUrl: './access-approval.component.html',
  styleUrls: ['./access-approval.component.css'],
  providers: [MydataserviceService]
})
export class AccessApprovalComponent implements OnInit {

  public chips = [
    { id: 1, name: 'OPEMPLOYEE', alias: 'OP EMPLOYEE', badge: 0, badgehidden: true, badgecolor: 'accent' },
    { id: 2, name: 'BRGYRESIDENT-PSG', alias: 'PSG', badge: 0, badgehidden: true, badgecolor: 'accent' },
    { id: 3, name: 'OPVISITOR-PRRD-GUEST', alias: 'PRRD GUEST', badge: 0, badgehidden: true, badgecolor: 'accent' },
    { id: 4, name: 'OPVISITOR-GENERAL-GUEST', alias: 'GENERAL GUEST', badge: 0, badgehidden: true, badgecolor: 'accent' },
    { id: 5, name: 'BRGYRESIDENT', alias: 'BRGY RESIDENT', badge: 0, badgehidden: true, badgecolor: 'accent' },
    { id: 6, name: 'BRGYRESIDENT-RTVM', alias: 'RTVM', badge: 0, badgehidden: true, badgecolor: 'accent' },
    { id: 7, name: 'BRGYRESIDENT-MESLA', alias: 'MESLA', badge: 0, badgehidden: true, badgecolor: 'accent' },
    { id: 8, name: 'BRGYRESIDENT-MECOOP', alias: 'MECOOP', badge: 0, badgehidden: true, badgecolor: 'accent' },
    { id: 9, name: 'OPVISITOR', alias: 'VISITOR', badge: 0, badgehidden: true, badgecolor: 'accent' },
    { id: 10, name: 'OPVISITOR-SECURITY-CLEARANCE', alias: 'SECURITY CLEARANCE', badge: 0, badgehidden: true, badgecolor: 'accent' },
    { id: 11, name: 'BRGYRESIDENT-PASSING-THRU', alias: 'PASSING THRU', badge: 0, badgehidden: true, badgecolor: 'accent' }
  ];

  public timeLeft: number = this.chips.length;
  public interval;

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
  current_distinction_alias = 'OP EMPLOYEE';
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
          this.service.useroffice = user.useroffice;
          this.getProfiles();
        });
    } catch (error) {
      this.authService.log(error);
    }

    this.updateBadges();

  }

  updateBadges() {

    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {

        // code here
        const id = 12 - this.timeLeft;

        const chip = this.chips.find(x => x.id === id);
        const distinction = chip.name;
        let nextstep = 100;
        this.service.getApprovalTemplateforBadges(distinction, this.service.usertype)
        .pipe(
          switchMap((usertemplate: any) => {
            nextstep = usertemplate.step;
            return this.service.getProfilesforBadges(
              this.service.find,
              distinction,
              nextstep,
              this.service.useroffice);
          })
        )
        .subscribe({
          next: (res: any) => {
            // tapos array find using distinction to update array item value
            const item = this.chips.find(x => x.name === distinction);
            const index = this.chips.indexOf(item);
            // update badges properties lang
            item.badge = res.totalDocs;
            if (item.badge < 1) {
              item.badgehidden = true;
            }
            if (item.badge >= 1 && item.badge <= 50) {
              item.badgehidden = false;
              item.badgecolor = 'accent';
            }
            if (item.badge >= 51 && item.badge <= 100) {
              item.badgehidden = false;
              item.badgecolor = 'primary';
            }
            if (item.badge > 100) {
              item.badgehidden = false;
              item.badgecolor = 'warn';
            }
            this.chips[index] = item;
          },
          complete: () => { }
        });

        // end code here

        this.timeLeft--;

      } else {
        this.timeLeft = this.chips.length;
        this.pauseTimer();
      }
    }, 500);


  }

  pauseTimer() {
    clearInterval(this.interval);
  }

  onDistinctionChipClick(chipname) {
    this.service.distinction = chipname;
    this.current_distinction = chipname;
    const chip = this.chips.find(c => c.name === chipname);
    this.current_distinction_alias = chip.alias;
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

      this.service.getApprovalTemplate()
      .pipe(
        map( (usertemplate: any) => {
          this.service.userapprovaltemplate = usertemplate;
          this.service.nextstep = usertemplate.step;
        }),
        switchMap(profiles => this.service.getProfiles(this.page))
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

      // // old working without approval template march 2019
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

    } else {
      this._done.next(true);
      this._loading.next(false);
    }
  }

  onProfileSuccess(res) {
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
    this.updateBadges();
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
