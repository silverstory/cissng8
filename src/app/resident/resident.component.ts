import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { MydataserviceService } from '../mydataservice.service';
import { SmsServiceService } from '../sms-service.service';
// approval templates
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Approvaltemplate, ApprovaltemplateObj } from '../approvaltemplate';
import { AccessApprovalDialogComponent } from '../access-approval-dialog/access-approval-dialog.component';
import { AuthService } from '../auth/auth.service';
import { switchMap, map, tap, mergeMap } from 'rxjs/operators';
// content
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
// end approval templates

// ** NEW ANIMATION ** //
import { trigger, stagger, animate, style, group, query, transition, keyframes } from '@angular/animations';
// import {trigger, stagger, animate, style, group, query as q, transition, keyframes} from '@angular/animations';
// const query = (s, a, o= {optional: true}) => q(s, a, o);

// ** OLD ANIMATION ** //
// import { trigger, animate, style, group, animateChild, query, stagger, transition, state, keyframes } from '@angular/animations';

import { Profile } from '../profile';

import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { ProfileService } from '../profile.service';

export const homeTransition = trigger('homeTransition', [
  transition(':enter', [
    query('.column', style({ opacity: 0 }), { optional: true }),
    query('.column', stagger(100, [
      style({ transform: 'translateY(100px)' }),
      animate('0.33s cubic-bezier(.75,-0.48,.26,1.52)', style({ transform: 'translateY(0px)', opacity: 1 })),
    ]), { optional: true }),
  ]),
  transition(':leave', [
    query('.column', stagger(100, [
      style({ transform: 'translateY(0px)', opacity: 1 }),
      animate('0.33s cubic-bezier(.75,-0.48,.26,1.52)', style({ transform: 'translateY(100px)', opacity: 0 })),
    ]), { optional: true }),
  ])
]);

@Component({
  selector: 'app-resident',
  // ** OLD ANIMATION ** //
  // animations: [
  //   trigger('flyInOut', [
  //     state('in', style({transform: 'translateY(0)'})),
  //     transition('void => *', [
  //       animate(1000, keyframes([
  //         style({opacity: 0, transform: 'translateY(100%)', offset: 0}),
  //         style({opacity: 1, transform: 'translateY(-15px)',  offset: 0.3}),
  //         style({opacity: 1, transform: 'translateY(0)',     offset: 1.0})
  //       ]))
  //     ]),
  //     transition('* => void', [
  //       animate(1000, keyframes([
  //         style({opacity: 1, transform: 'translateY(0)',     offset: 0}),
  //         style({opacity: 1, transform: 'translateY(15px)', offset: 0.7}),
  //         style({opacity: 0, transform: 'translateY(-100%)',  offset: 1.0})
  //       ]))
  //     ])
  //   ])
  // ],
  // // this one is the perfect transition for visitor :)
  // // animations: [
  // //   trigger('flyInOut', [
  // //     state('in', style({transform: 'translateY(0)'})),
  // //     transition('void => *', [
  // //       animate(1000, keyframes([
  // //         style({opacity: 0, transform: 'translateY(-100%)', offset: 0}),
  // //         style({opacity: 1, transform: 'translateY(15px)',  offset: 0.3}),
  // //         style({opacity: 1, transform: 'translateY(0)',     offset: 1.0})
  // //       ]))
  // //     ]),
  // //     transition('* => void', [
  // //       animate(1000, keyframes([
  // //         style({opacity: 1, transform: 'translateY(0)',     offset: 0}),
  // //         style({opacity: 1, transform: 'translateY(-15px)', offset: 0.7}),
  // //         style({opacity: 0, transform: 'translateY(100%)',  offset: 1.0})
  // //       ]))
  // //     ])
  // //   ])
  // // ],
  templateUrl: './resident.component.html',
  styleUrls: ['./resident.component.css'],
  // ** NEW ANIMATION ** //
  animations: [homeTransition],
  // tslint:disable-next-line:use-host-property-decorator
  // tslint:disable-next-line:no-host-metadata-property
  host: {
    '[@homeTransition]': ''
  }
})
export class ResidentComponent implements OnInit, OnDestroy {

  @Input() profile: Profile = null;
  navigationSubscription;

  public usertemplate: Approvaltemplate;

  // approval templates
  private api = '/api';
  steps = [];
  isLinear = true;
  completedBa = [];
  stepstext = [];
  // end approval templates

  constructor(
    public service: MydataserviceService,
    public smsService: SmsServiceService,
    public dialog: MatDialog,
    private authService: AuthService,
    public snackBar: MatSnackBar,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private profileService: ProfileService,
    private location: Location
  ) {
    // subscribe to the router events - storing the subscription so
    // we can unsubscribe later.
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.getProfile();
      }
    });
  }

  ngOnInit() {

    this.authService.getProfile()
      .pipe(
        map((user: any) => {
          this.service.usertype = user.usertype;
          this.service.useroffice = user.useroffice;
          const dist: string = String(this.profile.distinction);
          this.service.distinction = dist;
        }),
        switchMap(userapprovaltemplate => this.service.getApprovalTemplate())
      )
      .subscribe({
        next: (usertemplate: any) => {
          this.service.nextstep = usertemplate.step;
          this.usertemplate = new ApprovaltemplateObj(usertemplate);
        },
        complete: () => { }
      });

  }

  ngOnDestroy() {
    // avoid memory leaks here by cleaning up after ourselves. If we
    // don't then we will continue to run our initialiseInvites()
    // method on every navigationEnd event.
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  getProfile(): void {
    // if id is number use this (with plus sign)
    // const id = +this.route.snapshot.paramMap.get('id');
    const id = this.route.snapshot.paramMap.get('id');
    this.profile = null;
    this.profileService.getProfile(id)
      .subscribe(async profile => {
        this.profile = await profile;
        await this.getTemplates(profile);
      });
  }

  async getTemplates(profile: Profile) {
    // steps code here
    this.steps = await [];
    this.completedBa = await [];
    this.stepstext = await [];
    // tslint:disable-next-line:max-line-length
    const url = await `${this.api}/findapprovaltemplates?distinction=${profile.distinction}&page=1&limit=10`;
    const templates: any = await this.http.get(url).toPromise();
    if (templates !== null) {
      const items = await templates.docs;
      if (items !== undefined) {
        await items.forEach(async item => {
          await this.steps.push(await new ApprovaltemplateObj(item));
          if (item.step < profile.nextstep || profile.accessapproval === 'Distributed') {
            await this.completedBa.push(true);
            await this.stepstext.push(item.completedsteptext);
          } else {
            await this.completedBa.push(false);
            await this.stepstext.push(item.activesteptext);
          }
        });
      }
    }
    // end steps
  }

  getColor(status) {
    switch (status) {
      case 'ACTIVE':
        return '#B9F6CA';
      case 'INACTIVE':
        return '#E91E63';
      default:
        return '#E8EAF6';
    }
  }

  // Adding Access Request and Approval Functionality

  OnMatCardClickEvent(): void {
    if (this.service.nextstep === this.profile.nextstep) {
      if (this.service.useroffice !== 'NONE') {
        if (this.service.useroffice === this.profile.resident.barangay) {
          // visitor.visitordestination   for visitors
          // resident.barangay            for residents
          this.openDialog();
        }
      } else {
        this.openDialog();
      }
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

    dialogRef.afterClosed().subscribe(result => {
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
          this.saveProfile();
          break;
        case 'Deny Request':
          // set accessaproval to Denied
          this.profile = this.service.unfreezeProfile(p);
          this.profile.accessapproval = 'Denied';
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
          this.profile.nextstep = this.usertemplate.tosaveonprofilesnextstep;
          if (!p.distinction.includes('OPVISITOR')) {
            this.profile.recordstatus = 'ACTIVE';
          }
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
      .pipe(tap((res: any) => res))
      .subscribe({
        next: (res: any) => {
          const name = this.profile.gender === 'male' ? `Mr. ${this.profile.name.last}` : `Ms. ${this.profile.name.last}`;
          if (this.profile.accessapproval === 'Approved') {
            this.sendSMS(this.profile.mobile, `Good day ${name}!
 Your access request to Malacanang has been approved.
 You can view your Virtual ID using this link: ${this.profile.cissinqtext}`);
          } else if (this.profile.accessapproval === 'Denied') {
            this.sendSMS(this.profile.mobile, `Dear ${name},
 We regret to inform you that due to security reasons, your access request to Malacanang has been denied.`);
          } else {
            this.snackBar.open('Success!', 'Profile updated.', {
              duration: 5000,
            });
          }
          if (this.service.usertype === 'ID-PRINTING-OFFICER') {
            this.sendSMS(this.profile.mobile, `Good day ${name}!
 Your Malacanang Control ID is already printed.
 You may claim your Control ID from your respective ID Distribution Office after 24 hours.`);
          }
        },
        complete: () => {
          // refresh to updated profile
          this.getProfile();
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

}
