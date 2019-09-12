import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { MydataserviceService } from '../mydataservice.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApprovaltemplateObj } from '../approvaltemplate';
import { Observable } from 'rxjs';
import { Ipwhitelist } from '../ipwhitelist';
import { ValidateTokenService } from '../validate-token.service';
import { MatSnackBar } from '@angular/material';

// ** NEW ANIMATION ** //
import { trigger, stagger, animate, style, group, query, transition, keyframes } from '@angular/animations';

import { Profile } from '../profile';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';

export const homeTransition = trigger('homeTransition', [
  transition(':enter', [
    query('.column', style({ opacity: 0 }), { optional: true }),
    query('.column', stagger(300, [
      style({ transform: 'translateY(100px)' }),
      animate('1s cubic-bezier(.75,-0.48,.26,1.52)', style({ transform: 'translateY(0px)', opacity: 1 })),
    ]), { optional: true }),
  ]),
  transition(':leave', [
    query('.column', stagger(300, [
      style({ transform: 'translateY(0px)', opacity: 1 }),
      animate('1s cubic-bezier(.75,-0.48,.26,1.52)', style({ transform: 'translateY(100px)', opacity: 0 })),
    ]), { optional: true }),
  ])
]);

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Component({
  selector: 'app-op-id',
  templateUrl: './op-id.component.html',
  styleUrls: ['./op-id.component.css'],
  animations: [homeTransition],
  // tslint:disable-next-line:use-host-property-decorator
  // tslint:disable-next-line:no-host-metadata-property
  host: {
    '[@homeTransition]': ''
  }
})
export class OPIDComponent implements OnInit, OnDestroy {
  // myForm: FormGroup;
  @Input() profile: Profile = null;
  @Input() validate: String = null;
  @Input() resendToken: String = null;
  // @Input() invalidToken: String = null;
  private tmpProfile: Profile = null;
  name: string;
  valid: Boolean = false;
  navigationSubscription;
  client: String;
  phrase;
  token: String;
  profile_picture: any;

  // approval templates
  private api = '/api';
  steps = [];
  isLinear = true;
  completedBa = [];
  stepstext = [];
  // end approval templates

  constructor(public service: MydataserviceService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    // private fb: FormBuilder,
    private validateTokenService: ValidateTokenService,
    public snackBar: MatSnackBar
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

  async getProfile() {

    this.validate = null;
    this.profile = null;
    this.resendToken = null;
    // this.invalidToken = null;

    // get client ip
    const data = await this.http.get<any>('https://api.ipify.org?format=json').toPromise();
    this.client = data['ip'];

    // check if in the ip whitelist
    const ipurl = `${this.api}/ipwhitelist/c/${this.client}`;
    const ipwhitelist: Ipwhitelist = await this.http.get<Ipwhitelist>(ipurl).toPromise();
    // console.log(ipwhitelist);
    if (ipwhitelist !== null) {
      // show picture and status
      const phrase = this.route.snapshot.paramMap.get('text');
      const url = `${this.api}/opid/v/${phrase}`;
      this.profile = await this.http.get<Profile>(url).toPromise();
      this.profile_picture = await this.service.transformPBU(this.profile.photothumbnailurl);
      console.log(this.profile_picture);
      await this.getTemplates(this.profile);
    } else {
      const phrase = this.route.snapshot.paramMap.get('text');
      this.tmpProfile = null;
      this.valid = false;
      const url = `${this.api}/opid/v/${phrase}`;
      this.tmpProfile = await this.http.get<Profile>(url).toPromise();
      this.name = `${this.tmpProfile.profileid} ${this.tmpProfile.name.last}`;
      // present verify token input box
      this.validate = 'start validation';
      const sendToken: any = await this.validateTokenService.sendToken(this.tmpProfile.profileid, this.tmpProfile.distinction);
      if (sendToken.success) {
        this.snackBar.open('Verification code sent.', 'Code is now airborne =^=', {
          duration: 5000,
        });
      } else {
        this.resendToken = 'Sending failed';
        this.snackBar.open('Sending code failed!', 'Something went wrong :(', {
          duration: 5000,
        });
      }
    }
  }

  async getTemplates(profile: Profile) {
    // steps code here
    this.steps = await [];
    this.completedBa = await [];
    this.stepstext = await [];
    // tslint:disable-next-line:max-line-length
    const url = await `${this.api}/findapprovaltemplatesnoauth?distinction=${profile.distinction}&page=1&limit=10`;
    const templates: any = await this.http.get(url).toPromise();
    if (templates !== null) {
      const items = await templates.docs;
      if (items !== undefined) {
        let previousStep = -1;
        await items.forEach(async item => {
          if (item.step > previousStep) {
            await this.steps.push(await new ApprovaltemplateObj(item));
            let completeFlag = 'Distributed';
            if (profile.distinction.includes('OPEMPLOYEE')) {
              completeFlag = 'Distributed';
            } else if (profile.distinction.includes('BRGYRESIDENT')) {
              completeFlag = 'Distributed';
            } else if (profile.distinction.includes('OPVISITOR')) {
              completeFlag = 'Approved';
            } else if (profile.distinction.includes('EVENT')) {
              completeFlag = 'Approved';
            }
            if (item.step < profile.nextstep || profile.accessapproval === completeFlag) {
              await this.completedBa.push(true);
              await this.stepstext.push(item.completedsteptext);
            } else {
              await this.completedBa.push(false);
              await this.stepstext.push(item.activesteptext);
            }
          }
          previousStep = item.step;
        });
      }
    }
    // end steps
  }

  ngOnInit() { }

  async resendCode() {
    this.resendToken = null;
    const sendToken: any = await this.validateTokenService.sendToken(this.tmpProfile.profileid, this.tmpProfile.distinction);
    if (sendToken.success) {
      this.snackBar.open('Verification code sent.', 'Code is now airborne =^=', {
        duration: 5000,
      });
    } else {
      this.resendToken = 'Sending failed';
      this.snackBar.open('Sending code failed!', 'Something went wrong :(', {
        duration: 5000,
      });
    }
  }

  async onValidate() {
    this.valid =
      await this.validateTokenService.validateToken(this.tmpProfile.profileid, this.tmpProfile.distinction, this.token);
    if (this.valid) {
      // this.invalidToken = null;
      // hide token card
      this.validate = null;
      // show profile card
      const phrase = this.route.snapshot.paramMap.get('text');
      const url = `${this.api}/opid/v/${phrase}`;
      this.profile = await this.http.get<Profile>(url).toPromise();
      this.profile_picture = await this.service.transformPBU(this.profile.photothumbnailurl);
      await this.getTemplates(this.profile);
    } else {
      this.profile = null;
      // this.invalidToken = 'invalid token';
      this.snackBar.open('Oops, that is not a valid code.', 'Talk about restrictions!', {
        duration: 5000,
      });
    }
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

  ngOnDestroy() {
    // avoid memory leaks here by cleaning up after ourselves. If we
    // don't then we will continue to run our initialiseInvites()
    // method on every navigationEnd event.
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return error;
    };
  }

}

