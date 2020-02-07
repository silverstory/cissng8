import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, Inject } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { MydataserviceService } from '../mydataservice.service';
import { SmsServiceService } from '../sms-service.service';
import { Profile, ProfileObj } from '../profile';
import { Approvaltemplate, ApprovaltemplateObj } from '../approvaltemplate';
import { Distinction, DistinctionObj } from '../distinction';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { AccessApprovalDialogComponent } from '../access-approval-dialog/access-approval-dialog.component';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSlideToggleChange } from '@angular/material';
import { switchMap, map, tap, mergeMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UrlHandlingStrategy } from '@angular/router';

import { transition, trigger, useAnimation } from '@angular/animations';
import { slideFadeIn, slideFadeOut, useSlideFadeInAnimation, useSlideFadeOutAnimation } from '../../animations';
import {
  bounceInAndOut, enterAndLeaveFromLeft, enterAndLeaveFromRight, fadeInAndOut,
  fadeInThenOut, growInShrinkOut, swingInAndOut
} from '../../triggers';

import { ProfileAction } from '../profileaction';
import { NotifyGroup } from '../notifygroup';
import { UnverifiedRequest } from '../unverifiedrequest';

export interface Event {
  code: string;
}

@Component({
  selector: 'app-access-approval',
  templateUrl: './access-approval.component.html',
  styleUrls: ['./access-approval.component.css'],
  animations: [
    // The following are pre-built triggers - Use these to add animations with the least work
    growInShrinkOut, fadeInThenOut, swingInAndOut, fadeInAndOut,
    enterAndLeaveFromLeft, enterAndLeaveFromRight, bounceInAndOut,

    // The following is a custom trigger using animations from the package
    // Use this approach if you need to customize the animation or use your own states
    trigger('enterFromLeftLeaveToRight', [
      // this transition uses a function that returns an animation with custom parameters
      transition(':enter', useSlideFadeInAnimation('300ms', '20px')),
      // This transition uses useAnimation and passes the parameters directly - accomplishing the same thing as the above function
      transition(':leave', useAnimation(slideFadeOut, { params: { time: '2000ms', endPos: '100px' } })),
    ]),
  ],
})
export class AccessApprovalComponent implements OnInit {

  // eventcode
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  events: Event[] = [];
  // end eventcode

  public chips = [];

  public statuschips = [
    {
      id: 1, name: 'New Record', alias: 'New', badge: 0, badgehidden: true,
      default_color: 'primary',
      chipcolor: 'primary', badgecolor: 'accent', badgesize: 'medium'
    },
    {
      id: 2, name: 'Provisional', alias: 'Provi', badge: 0, badgehidden: true,
      default_color: 'accent',
      chipcolor: 'accent', badgecolor: 'primary', badgesize: 'medium'
    },
    {
      id: 3, name: 'Approved', alias: 'Apprvd', badge: 0, badgehidden: true,
      default_color: 'primary',
      chipcolor: 'primary', badgecolor: 'accent', badgesize: 'medium'
    },
    // {
    //   id: 4, name: 'Printed', alias: 'Printed', badge: 0, badgehidden: true,
    //   default_color: 'accent',
    //   chipcolor: 'accent', badgecolor: 'primary', badgesize: 'medium'
    // },
    // {
    //   id: 5, name: 'Distributed', alias: 'Dist', badge: 0, badgehidden: true,
    //   default_color: 'primary',
    //   chipcolor: 'primary', badgecolor: 'accent', badgesize: 'medium'
    // },
    {
      id: 4, name: 'Denied', alias: 'Denied', badge: 0, badgehidden: true,
      default_color: 'accent',
      chipcolor: 'accent', badgecolor: 'primary', badgesize: 'medium'
    },
  ];

  public face_icons = [
    'OPEMPLOYEE',
    'OPEMPLOYEE-VIP',
    'BRGYRESIDENT-PSG',
    'OPVISITOR',
    'OPVISITOR-VIP',
    'BRGYRESIDENT',
    'BRGYRESIDENT-RTVM',
    'OPVISITOR-SECURITY-CLEARANCE',
    'EVENT-GUEST',
    'EVENT-VIP'
  ];

  private api = '/api';

  public usertemplate: Approvaltemplate;

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

  selectedAnimation = 'slideFromRight';
  // SHOWING THE LIST OP EMPLOYEES WITH APPROVED STATUS
  titles: String[] = [`SHOWING THE LIST OF
  ${ this.current_distinction_alias.toUpperCase()}S
  WITH ${ this.service.find.toUpperCase()} STATUS`];

  // for selected chip
  prev_dist = 'OPEMPLOYEE';
  next_dist = 'OPEMPLOYEE';
  prev_stat = 'Provisional';
  next_stat = 'Provisional';
  // end for selected chip

  constructor(public service: MydataserviceService,
    public smsService: SmsServiceService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private authService: AuthService,
    private http: HttpClient
  ) { }

  async ngOnInit() {

    // get all distinctions
    this.service.getDistinctions()
      .pipe(
        tap((res: any) => res)
      )
      .subscribe({
        next: (res: any) => {
          const items = res.docs;
          if (items !== undefined) {
            items.forEach(item => {
              this.chips.push(new DistinctionObj(item));
            });
          }
        },
        complete: () => {
          // this._done.next(true);
          // this._loading.next(false);
        }
      });
    // end get all distinctions

    this._loading.next(true);
    this.service.find = 'Provisional';
    this.service.distinction = 'OPEMPLOYEE';
    this.current_distinction = 'OPEMPLOYEE';
    this.current_approvalstatus = 'Provisional';
    this.current_distinction_alias = 'OP EMPLOYEE';
    this.service.usertype = '';
    this.service.useroffice = '';
    this.service.eventcode = '';
    this.service.eventcreator = '';
    this.service.nextstep = 100;
    this.service.limit = 8; // limit must be atleast 8 and above
    this.service.newestFirst = true;
    this.prev_dist = 'OPEMPLOYEE';
    this.next_dist = 'OPEMPLOYEE';
    this.prev_stat = 'Provisional';
    this.next_stat = 'Provisional';

    this.changeStatColor();
    this.changeDistColor();

    this.titles = [`SHOWING THE LIST OF
    ${ this.current_distinction_alias.toUpperCase()}S
    WITH ${ this.service.find.toUpperCase()} STATUS`];

    try {
      await this.authService.getProfile()
        .subscribe((user) => {
          this.service.usertype = user.usertype;
          this.service.useroffice = user.useroffice;
          this.service.eventcreator = user.eventcreator ? user.eventcreator : '';
          this.getProfiles();
        });
    } catch (error) {
      this.authService.log(error);
    }

    setTimeout(async () => {
      await this.updateStatusBadges();
      await this.updateBadges();
    }, 1000);

  }

  saveProfileAction(p: ProfileAction): void {
    this.service.saveProfileAction(p)
      .pipe(tap((res: any) => res))
      .subscribe({
        next: (res: any) => {
        },
        complete: () => {
          // get Today's Totals using the new API
          // todaytotal: {
          //   peopleinside
          //   visitorinside
          //   employeeinside
          //   touristinside
          //   nonopemployeeinside
          // }
          //
          // then emit the result to socket server
          // which will broadcast the totals
        }
      });
  }

  saveUnverifiedRequest(u: UnverifiedRequest): void {
    this.service.saveUnverifiedRequest(u)
      .pipe(tap((res: any) => res))
      .subscribe({
        next: (res: any) => {
        },
        complete: () => {
          // well, do something, just anything
        }
      });
  }

  async changeStatColor() {
    // make prev color back to default
    const stat_prev_index = this.statuschips.findIndex(x => x.name === this.prev_stat);
    this.statuschips[stat_prev_index].chipcolor = this.statuschips[stat_prev_index].default_color;
    // set next color to none
    const stat_next_index = this.statuschips.findIndex(x => x.name === this.next_stat);
    this.statuschips[stat_next_index].chipcolor = 'warn';
  }

  async changeDistColor() {
    // make prev color back to default
    const dist_prev_index = this.chips.findIndex(x => x.name === this.prev_dist);
    this.chips[dist_prev_index].chipcolor = this.chips[dist_prev_index].default_color;
    // set next color to none
    const dist_next_index = this.chips.findIndex(x => x.name === this.next_dist);
    this.chips[dist_next_index].chipcolor = 'warn';
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

  async updateBadges() {

    this.chips.forEach(async (chip) => {

      const distinction = chip.name;
      const usertype = this.service.usertype;
      const findtext = this.service.find;
      const largemeter = 99;
      let nextstep = 100;

      const body = {
        distinction: distinction,
        usertype: usertype
      };
      const approvaltemplateurl = '/api/approvaltemplate';
      const approvaltemplate: Approvaltemplate = await this.http.post<Approvaltemplate>(approvaltemplateurl, body).toPromise();
      if (approvaltemplate !== null) {
        nextstep = approvaltemplate.step;
      }

      let useroffice = this.service.useroffice;
      // put new event workflow here
      if (distinction.includes('EVENT')) {
        if (this.service.eventcreator !== undefined && this.service.eventcreator !== '') {
          useroffice = this.service.eventcreator;
        }
        if (this.service.eventcode !== undefined && this.service.eventcode !== '') {
          useroffice = this.service.eventcode;
        }
      }

      // tslint:disable-next-line:max-line-length
      const url = `/api/profile/accessapprovals?findtext=${findtext}&distinction=${distinction}&nextstep=${nextstep}&useroffice=${useroffice}&page=1&limit=1&newestfirst=${true}`;
      const profile: any = await this.http.get<any>(url).toPromise();
      if (profile !== null) {
        // const item = this.chips.find(x => x.name === distinction);
        const item = chip;
        const index = this.chips.indexOf(item);
        // update badges properties lang
        item.badge = profile.totalDocs;
        if (item.badge < 1) {
          item.badgehidden = true;
        }
        if (item.badge >= 1 && item.badge <= largemeter) {
          item.badgehidden = false;
          item.badgecolor = 'accent';
          item.badgesize = 'medium';
        }
        if (item.badge > largemeter) {
          item.badgehidden = false;
          item.badgecolor = 'accent';
          item.badgesize = 'large';
          if (findtext === 'Approved') {
            item.badgesize = 'medium';
          }
        }
        this.chips[index] = item;
      }

    });

  }

  onDistinctionChipClick(chipname) {
    this.service.distinction = chipname;
    this.current_distinction = chipname;
    this.prev_dist = this.next_dist;
    this.next_dist = chipname;
    this.changeDistColor();
    const chip = this.chips.find(c => c.name === chipname);
    this.current_distinction_alias = chip.alias;
    const x = `SHOWING THE LIST OF
    ${ this.current_distinction_alias.toUpperCase()}S
    WITH ${ this.service.find.toUpperCase()} STATUS`;
    this.titles = [x];
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

  // status badge updater
  async updateStatusBadges() {

    const largemeter = 99;
    const usertype = this.service.usertype;

    // iterate through statuses using
    for await (const statuschip of this.statuschips) {

      // initialize count = 0;
      let count = 0;
      const findtext = statuschip.name;

      // iterate through each distinction passing the
      // loop item status as parameter to the api call
      for await (const chip of this.chips) {

        // get approval template
        const distinction = chip.name;
        let nextstep = 100;

        const body = {
          distinction: distinction,
          usertype: usertype
        };
        const approvaltemplateurl = '/api/approvaltemplate';
        const approvaltemplate: Approvaltemplate = await this.http.post<Approvaltemplate>(approvaltemplateurl, body).toPromise();
        if (approvaltemplate !== null) {
          nextstep = approvaltemplate.step;
        }

        let useroffice = this.service.useroffice;
        // put new event workflow here
        if (distinction.includes('EVENT')) {
          if (this.service.eventcreator !== undefined && this.service.eventcreator !== '') {
            useroffice = this.service.eventcreator;
          }
          if (this.service.eventcode !== undefined && this.service.eventcode !== '') {
            useroffice = this.service.eventcode;
          }
        }

        // tslint:disable-next-line:max-line-length
        const url = `/api/profile/accessapprovals?findtext=${findtext}&distinction=${distinction}&nextstep=${nextstep}&useroffice=${useroffice}&page=1&limit=1&newestfirst=${true}`;
        const profile: any = await this.http.get<any>(url).toPromise();
        if (profile !== null) {
          count += profile.totalDocs;
        }

      } // end iterate through each distinction

      // update status badge
      const item = statuschip;

      const index = this.statuschips.indexOf(item);
      // update badges properties lang
      item.badge = count;
      if (item.badge < 1) {
        item.badgehidden = true;
      }
      if (item.badge >= 1 && item.badge <= largemeter) {
        item.badgehidden = false;
        item.badgesize = 'medium';
      }
      if (item.badge > largemeter) {
        item.badgehidden = false;
        item.badgesize = 'large';
      }
      this.statuschips[index] = item;

    } // end statuses iteration

  } // end status badge updater

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
          map((usertemplate: any) => {
            this.service.userapprovaltemplate = new ApprovaltemplateObj(usertemplate);
            this.usertemplate = new ApprovaltemplateObj(usertemplate);
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
        this.myProfileList.push(this.service.createFreezedProfile(new ProfileObj(item)));
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
        return `Code ${code} `;
    }
  }

  openDialog(): void {
    const p: Profile = this.service.createFreezedProfile(this.profile);
    const dialogRef = this.dialog.open(AccessApprovalDialogComponent, {
      // this should not be 700px and must implement css grid styling
      // width: '100%',
      width: 'calc(100%)',
      data: {
        profile: this.profile,
        freezedProfile: p,
        action: '',
        usertemplate: this.usertemplate
      }
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      // console.log('The dialog was closed ', result);
      // result.action here
      switch (result.action) {
        case 'Cancelled':
          this.profile = p;
          break;
        case 'Endorse Access':
          // set accessaproval to Provisional
          this.profile = result.profile;
          this.profile.accessapproval = 'Provisional';
          this.profile.nextstep = this.usertemplate.tosaveonprofilesnextstep;
          // update db with this.profile
          await this.actOnRequest();
          this.saveProfile();
          break;
        case 'Deny Request':
          // set accessaproval to Denied
          this.profile = this.service.unfreezeProfile(p);
          this.profile.accessapproval = 'Denied';
          // if event, update vegas guest status
          if (this.profile.distinction.includes('EVENT')) {
            let msgToVegas = 'Denied';
            // if usertype is head
            if (this.service.usertype === 'OFFICEHEAD') {
              msgToVegas = 'Denied by Head';
            }
            const res: any =
              this.service.issueEventApproval(
                this.profile.cisscode,
                msgToVegas,
                this.profile.distinction);
            console.log(res.success);
          }
          await this.actOnRequest();
          this.profile.nextstep = 0;
          // update db with this.profile
          this.saveProfile();
          break;
        case 'Approve Request':
          // set access to proviaccess
          this.profile = result.profile;
          this.profile.access = this.profile.proviaccess;
          // set accessaproval to Approved
          this.profile.accessapproval = 'Approved';
          this.profile.recordstatus = 'ACTIVE';
          // if event, update vegas guest status
          if (this.profile.distinction.includes('EVENT')) {
            let msgToVegas = 'Approved';
            // if usertype is head
            if (this.service.usertype === 'OFFICEHEAD') {
              this.profile.accessapproval = 'Provisional';
              msgToVegas = 'Approved by Head';
            }
            const res: any =
              this.service.issueEventApproval(
                this.profile.cisscode,
                msgToVegas,
                this.profile.distinction);
            console.log(res.success);
          }
          await this.actOnRequest();
          this.profile.nextstep = this.usertemplate.tosaveonprofilesnextstep;
          // update db with this.profile
          this.saveProfile();
          break;
        case 'ID Printed':
          // set access to proviaccess
          this.profile = result.profile;
          this.profile.access = this.profile.proviaccess;
          // set accessaproval to Printed
          this.profile.accessapproval = 'Printed';
          await this.actOnRequest();
          this.profile.nextstep = this.usertemplate.tosaveonprofilesnextstep;
          // update db with this.profile
          this.saveProfile();
          break;
        case 'ID Distributed':
          // set access to proviaccess
          this.profile = result.profile;
          this.profile.access = this.profile.proviaccess;
          // set accessaproval to Distributed
          this.profile.accessapproval = 'Distributed';
          if (!p.distinction.includes('OPVISITOR')) {
            this.profile.recordstatus = 'ACTIVE';
          }
          await this.actOnRequest();
          this.profile.nextstep = this.usertemplate.tosaveonprofilesnextstep;
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

  async actOnRequest() {
    // get usertype
    const usertype = this.authService.getUserType();
    // then update unverifiedrequest by supplying
    // profileid + distinction + usertype
    // use PUT (update) API
    // use url: /unverified/update
    // with this object;
    const measure = {
      profileid: this.profile.profileid,
      distinction: this.profile.distinction,
      usertype: usertype
    };
    // find the targeted profile in unverifiedrequests
    const path = `${this.api}/unverified/findunacted`;
    const unverifiedrequest: UnverifiedRequest = await this.http.post<UnverifiedRequest>(path, measure).toPromise();
    if (unverifiedrequest !== null) {
      // prepare transformation
      // const usertype = this.authService.getUserType();
      const username = this.authService.getUserName();
      // const dateobj = new Date();
      // const B = dateobj.toISOString();
      const B = new Date();
      // transform object to unverifiedrequest object
      unverifiedrequest.username = username;
      unverifiedrequest.acted = 'Yes';
      unverifiedrequest.dateacted = B;
      // save to document
      const update_url = `${this.api}/unverified/${unverifiedrequest._id}`;
      const put_unverifiedrequest: UnverifiedRequest = await this.http.put<UnverifiedRequest>(update_url, unverifiedrequest).toPromise();
    }
  }

  saveProfile(): void {
    this.service.saveProfile(this.profile)
      .pipe(tap((res: any) => res))
      .subscribe({
        next: (res: any) => {
          const name = this.profile.gender === 'male' ? `Mr. ${this.profile.name.last}` : `Ms. ${this.profile.name.last}`;
          this.snackBar.open('Profile information changed!', 'Profile updated.', {
            duration: 5000,
          });
          if (this.profile.accessapproval === 'Approved') {
            this.sendSMS(this.profile.mobile, `Good day ${name}!
 Your access request to Malacanang / OP Proper has been approved.
 You can view your Virtual ID using this link: ${this.profile.cissinqtext}`);
          } else if (this.profile.accessapproval === 'Denied') {
            this.sendSMS(this.profile.mobile, `Dear ${name},
 We regret to inform you that due to security concerns, your access request to Malacanang / OP Proper has been denied.`);
          } else { }
          if (this.service.usertype === 'ID-PRINTING-OFFICER') {
            this.sendSMS(this.profile.mobile, `Good day ${name}!
 Your new OP ID / Malacanang Control ID is already printed.
 You may claim your new OP ID / Malacanang Control ID from your respective ID Distribution Office after 24 hours.`);
          }
        },
        complete: async () => {

          // create reusable profile object
          const _profile: Profile = this.service.createFreezedProfile(this.profile);

          // save profile action to db
          const user = this.authService.getUserType();
          const response = 'update_profile';
          const dateobj = new Date();
          const B = dateobj.toISOString();

          const target: any = this.service.unfreezeProfile(_profile);
          const source = {
            action: {
              user: user,
              response: response
            }
          };
          const returnedTarget: any = Object.assign(target, source);
          this.saveProfileAction(returnedTarget);

          // Create an UnverifiedRequest document

          // first get next approver
          // first get the usertype of the next approver using
          // tosaveonprofilesnextstep property and consuming
          // approval template API to find step and distinction
          // use url: /approvaltemplate/usertype
          // use tosaveonprofilesnextstep to find next approver
          let nextusertype: String = '';
          const nextstepdist = {
            step: this.usertemplate.tosaveonprofilesnextstep,
            distinction: this.usertemplate.distinction
          };
          const apurl = `${this.api}/approvaltemplate/usertype`;
          const approvaltemplate: Approvaltemplate = await this.http.post<Approvaltemplate>(apurl, nextstepdist).toPromise();
          if (approvaltemplate !== null) {
            nextusertype = approvaltemplate.usertype;
          }
          // end get next approver

          // check if the next approver exists in the
          // notifygroup collection using NotifyGroup API
          const typedist = {
            usertype: nextusertype,
            distinction: nextstepdist.distinction
          };
          const url = `${this.api}/notifygroup/bytypedist`;
          const notifygroup: NotifyGroup = await this.http.post<NotifyGroup>(url, typedist).toPromise();
          // save transformed profile to unverifiedrequest collection
          if (notifygroup !== null) {
            // Create an unverifiedrequest document
            // use POST (create) API

            // transform object to unverifiedrequest object
            // - adding new property to object
            const unverifiedrequest: any = this.service.unfreezeProfile(_profile);
            // delete unverifiedrequest.action;
            unverifiedrequest.usertype = notifygroup.usertype;
            unverifiedrequest.username = '';
            unverifiedrequest.message = notifygroup.message;
            this.saveUnverifiedRequest(unverifiedrequest);
          }
          // end Create an UnverifiedRequest document

          // refresh infin8 list
          this.refreshInfin8List();
          this.updateStatusBadges();
          this.updateBadges();
        }
      });
  }

  async sendSMS(mobile: String, message: String) {
    const smsResponse: any = await this.smsService.sendSMS(mobile, message);
    if (smsResponse.success) {
      this.snackBar.open(`Notification sent to ${this.profile.name.first} ${this.profile.name.last}'s mobile number.`,
        'Sending notification succeeded.', {
        duration: 7000,
      });
    } else {
      this.snackBar.open('Sending notification failed!', 'Something went wrong :(', {
        duration: 7000,
      });
    }
  }

  // findNotifyGroup(n: NotifyGroup): void {
  //   this.service.getNotifyGroup(n)
  //     .pipe(tap((res: any) => res))
  //     .subscribe({
  //       next: (res: any) => {
  //       },
  //       complete: () => {
  //         //
  //       }
  //     });
  // }

  OnMatCardClickEvent(item: any): void {
    // On approval component mat card click, add checks if
    // distinction includes EVENT
    // then if user is the owner of the event OR
    // if user eventcreator value is 'SA'
    let openD = true;
    const _profile: Profile = <Profile>item;
    if (_profile.distinction.includes('EVENT')) {
      openD = false;
      if (this.service.eventcreator === _profile.event.eventcreator ||
        this.service.eventcreator === 'SA') {
        openD = true;
      }
    }
    if (openD === true) {
      this.profile = <Profile>item;
      this.openDialog();
    }
  }

  OnAccessTypeClickEvent(type: string): void {
    this.service.find = type;
    this.current_approvalstatus = type;
    this.prev_stat = this.next_stat;
    this.next_stat = type;
    this.changeStatColor();
    const x = `SHOWING THE LIST OF
    ${ this.current_distinction_alias.toUpperCase()}S
    WITH ${ this.service.find.toUpperCase()} STATUS`;
    this.titles = [x];
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

  // eventcode
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.events.push({ code: value.trim() });

      // new chip has been added so
      // do CISS event logic here
      this.service.eventcode = value.trim();
      if (!(this.service.distinction.includes('EVENT')) &&
        (this.service.eventcode !== undefined && this.service.eventcode !== '')) {
        this.service.distinction = 'EVENT-GUEST';
        this.service.find = 'New Record';
        this.current_distinction = 'EVENT-GUEST';
        this.prev_dist = this.next_dist;
        this.next_dist = 'EVENT-GUEST';
        this.current_approvalstatus = 'New Record';
        this.prev_stat = this.next_stat;
        this.next_stat = 'New Record';
        this.changeStatColor();
        this.changeDistColor();
        this.current_distinction_alias = 'EVENT GUEST';
        const x = `SHOWING THE LIST OF
              ${ this.current_distinction_alias.toUpperCase()}S
              WITH ${ this.service.find.toUpperCase()} STATUS`;
        this.titles = [x];
      }
      this.refreshInfin8List();
      this.updateStatusBadges();
      this.updateBadges();

      // then always limit array size to 1
      this.events = [{ code: value.trim() }, ...this.events.slice(0, 0)];
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

  }

  remove(event: Event): void {
    const index = this.events.indexOf(event);

    if (index >= 0) {
      this.events.splice(index, 1);
      // do logic here
      this.service.eventcode = '';
      if (this.service.distinction.includes('EVENT')) {
        this.refreshInfin8List();
      }
      this.updateStatusBadges();
      this.updateBadges();
    }
  }
  // end eventcode

}
