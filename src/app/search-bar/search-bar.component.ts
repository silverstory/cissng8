import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
// import { Component, OnInit, ViewEncapsulation, HostBinding } from '@angular/core';
import { Component, OnInit, Input } from '@angular/core';
import { Profile } from '../profile';
import { ProfileService } from '../profile.service';
// import { routerTransition } from '../router.animations';

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
              private router: Router
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
      .subscribe( profile => {

        let component_page = '';

        if (profile) {

          // third determine the type of individual
          if (profile.distinction === 'OPEMPLOYEE') {
            this.color = this.getColor(profile.recordstatus);
            component_page = '/employee';
          } else if (profile.distinction === 'OPVISITOR') {
            this.color = this.getVisitorColor(profile.visitor.visitstatus);
            component_page = '/visitor';
          } else if (profile.distinction === 'BRGYRESIDENT') {
            this.color = this.getColor(profile.recordstatus);
            component_page = '/resident';
          } else {
            // employee page for now if not a known type
            component_page = '/employee';
          }

          // fourth route to appropriate profile component
          const route_page = `${component_page}/${profile._id}`;
          this.router.navigate( [ route_page ]);

        } else {
          // navigate to profile not found page
          this.router.navigate( [ '/profilenotfound' ]);
        }

      },
      err => {
        // navigate to profile not found page
        this.router.navigate( [ '/profilenotfound' ]);
      },
      () => {
        console.log(`We're done here!`);
      });
    } catch (error) {
      // navigate to profile not found page
      this.router.navigate( [ '/profilenotfound' ]);
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

  getVisitorColor(status) {
    switch (status) {
      case 'APPROVED':
        return '#B9F6CA';
      case 'DENIED':
        return '#E91E63';
      default:
        return '#E8EAF6';
    }
  }

}
