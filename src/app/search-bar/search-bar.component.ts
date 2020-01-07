import { BehaviorSubject, Observable, from } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
// import { Component, OnInit, ViewEncapsulation, HostBinding } from '@angular/core';
import { Component, OnInit, Input } from '@angular/core';
import { Profile } from '../profile';
import { ProfileService } from '../profile.service';
// import { routerTransition } from '../router.animations';
import { LivefeedListService } from '../state/livefeed-list.service';
import { EntireListService } from '../state/entire-list.service';
import { MydataserviceService } from '../mydataservice.service';
import { switchMap, map, tap, mergeMap } from 'rxjs/operators';
import { ProfileAction } from '../profileaction';

@Component({
  selector: 'app-search-bar',
  // animations: [ routerTransition ],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
  // encapsulation: ViewEncapsulation.None
})
export class SearchBarComponent implements OnInit {

  // @HostBinding('@routerTransition') routerTransition = true; // dinagdag lang

  isLoggedIn$: Observable<boolean>;                  // {1}
  value = '';
  @Input() color: String = '#E8EAF6';

  constructor(private authService: AuthService,
    private profileService: ProfileService,
    private router: Router,
    public livefeedList: LivefeedListService,
    public entireList: EntireListService,
    public service: MydataserviceService
  ) { }

  ngOnInit() {
    this.isLoggedIn$ = this.authService.isLoggedIn; // {2}
  }

  search(str: string) {

    // check if str has value or you need to use this.value var here

    // first detect pop the hmac from the url
    str = str.trim();
    if (!str) { return; }
    const url_arr = str.split('/');
    const hmac = url_arr.pop();

    setTimeout(() => {
      this.value = '';
    }, 1000);

    // second find and retrieve the document from db
    try {

      this.profileService
        .findProfile(hmac)
        .subscribe(profile => {

          let component_page = '';

          if (profile) {

            // third determine the type of individual
            // use sentence.includes(word)
            // profile.distinction === 'OPEMPLOYEE'
            if (profile.distinction.includes('OPEMPLOYEE')) {
              this.color = this.getColor(profile.recordstatus);
              component_page = '/employee';
            } else if (profile.distinction.includes('OPVISITOR')) {
              this.color = this.getGuestColor(profile.accessapproval);
              component_page = '/visitor';
            } else if (profile.distinction.includes('BRGYRESIDENT')) {
              this.color = this.getColor(profile.recordstatus);
              component_page = '/resident';
            } else if (profile.distinction.includes('EVENT')) {
              this.color = this.getGuestColor(profile.accessapproval);
              component_page = '/event';
            } else {
              // resident page for now if not a known type
              component_page = '/resident';
            }

            this.feed(profile);
            this.add(profile);

            // save profile action to db
            const user = this.authService.getUserType();
            const response = user.includes('_IN') ? 'touchdown_in' : 'touchdown_out';
            const dateobj = new Date();
            const B = dateobj.toISOString();

            const target = profile;
            const source = {
              action: {
                user: user,
                response: response
              }
            };
            const returnedTarget: any = Object.assign(target, source);
            this.saveProfileAction(returnedTarget);

            // fourth route to appropriate profile component
            const route_page = `${component_page}/${profile._id}`;
            this.router.navigate([route_page]);

          } else {
            // navigate to profile not found page
            this.router.navigate(['/profilenotfound']);
          }

        },
          err => {
            // navigate to profile not found page
            this.router.navigate(['/profilenotfound']);
          },
          () => {
            console.log(`We're done here!`);
          });
    } catch (error) {
      // navigate to profile not found page
      this.router.navigate(['/profilenotfound']);
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

  getGuestColor(status) {
    if (status === 'Approved') {
      return '#B9F6CA';
    } else {
      return '#E91E63';
    }
  }

  feed(p: Profile) {
    const profileid: string = String(p.profileid);
    const name: string = String(p.name.first + ' ' + p.name.last);
    const gender: string = String(p.gender);
    const photothumbnailurl: string = String(p.photothumbnailurl);
    const distinction: string = String(p.distinction);
    const usertype = this.authService.getUserType();
    const qrcode: string = String(p.cissinqtext);
    const datetime: Date = new Date();
    this.livefeedList.feed(
      profileid,
      name,
      gender,
      photothumbnailurl,
      distinction,
      usertype,
      qrcode,
      datetime);
  }

  add(p: Profile) {
    const profileid: string = String(p.profileid);
    const name: string = String(p.name.first + ' ' + p.name.last);
    const gender: string = String(p.gender);
    const photothumbnailurl: string = String(p.photothumbnailurl);
    const distinction: string = String(p.distinction);
    const usertype = this.authService.getUserType();
    const qrcode: string = String(p.cissinqtext);
    const datetime: Date = new Date();
    this.entireList.add(
      profileid,
      name,
      gender,
      photothumbnailurl,
      distinction,
      usertype,
      qrcode,
      datetime);
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

}
