// import { Component, OnInit, Input, ViewEncapsulation, HostBinding } from '@angular/core';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';

// ** NEW ANIMATION ** //
import {trigger, stagger, animate, style, group, query, transition, keyframes} from '@angular/animations';
// import {trigger, stagger, animate, style, group, query as q, transition, keyframes} from '@angular/animations';
// const query = (s, a, o= {optional: true}) => q(s, a, o);

// ** OLD ANIMATION ** //
// import { trigger, animate, style, group, animateChild, query, stagger, transition, state, keyframes } from '@angular/animations';

import { Profile } from '../profile';

import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { ProfileService } from '../profile.service';
// import { routerTransition } from '../router.animations';
// original stagger 300
// original animate 1s
export const homeTransition = trigger('homeTransition', [
  transition(':enter', [
    query('.column', style({ opacity: 0 }), { optional: true }),
    query('.column', stagger(100, [
      style({ transform: 'translateY(100px)' }),
      animate('0.33s cubic-bezier(.75,-0.48,.26,1.52)', style({transform: 'translateY(0px)', opacity: 1})),
    ]), { optional: true }),
  ]),
  transition(':leave', [
    query('.column', stagger(100, [
      style({ transform: 'translateY(0px)', opacity: 1 }),
      animate('0.33s cubic-bezier(.75,-0.48,.26,1.52)', style({transform: 'translateY(100px)', opacity: 0})),
    ]), { optional: true }),
  ])
]);

// export interface Tile {
//   color: string;
//   cols: number;
//   rows: number;
//   text: string;
// }

@Component({
  selector: 'app-employee',
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
  // // animations: [ routerTransition ],
  // // animations: [
  // //   trigger('flyInOut', [
  // //     state('in', style({opacity: 1, transform: 'translateY(0)'})),
  // //     transition('void => *', [
  // //       style({
  // //         opacity: 0,
  // //         transform: 'translateY(100%)'
  // //       }),
  // //       animate('0.5s ease-in') /* animate('0.2s ease-in') */
  // //     ]),
  // //     transition('* => void', [
  // //       animate('0.5s 0.25s ease-out', style({ /* animate('0.2s 0.1s ease-out', style({ */
  // //         opacity: 0,
  // //         transform: 'translateY(-100%)'
  // //       }))
  // //     ])
  // //   ])
  // // ],
  // // animations: [
  // //   trigger('flyInOut', [
  // //     transition('* => *', [ // each time the binding value changes
  // //       query(':leave', [
  // //         stagger(400, [
  // //           animate('0.5s ease-out', style({ opacity: 0 }))
  // //         ])
  // //       ], { optional: true }),
  // //       query(':enter', [
  // //         style({ opacity: 0 }),
  // //         stagger(400, [
  // //           style({ transform: 'translateY(100px)' }),
  // //           animate('1s ease-in',
  // //             style({ transform: 'translateY(0px)', opacity: 1 })),
  // //         ]),
  // //       ], { optional: true }),
  // //     ])
  // //   ])
  // // ],
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
  // ** NEW ANIMATION ** //
  animations: [ homeTransition ],
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '[@homeTransition]': ''
  }
  // encapsulation: ViewEncapsulation.None
})
export class EmployeeComponent implements OnInit, OnDestroy {

  // @HostBinding('@routerTransition') routerTransition = true; // dinagdag lang

  @Input() profile: Profile = null;
  navigationSubscription;

  // tiles: Tile[] = [
  //   {text: '1', cols: 2, rows: 1, color: '#CFD8DC'},
  //   {text: '2', cols: 2, rows: 1, color: '#CFD8DC'},
  //   {text: '', cols: 4, rows: 6, color: 'url(https://www.freeiconspng.com/uploads/flat-face-icon-23.png)'},
  //   {text: '3', cols: 2, rows: 1, color: '#CFD8DC'},
  //   {text: '4', cols: 2, rows: 1, color: '#CFD8DC'},
  // ];

  constructor(
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

  ngOnInit() { }

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
      .subscribe(profile => {
        this.profile = profile;
        // this.tiles = [
        //   {text: '1', cols: 2, rows: 1, color: this.getTileAccess(this.profile.access.one, 'One') },
        //   {text: '2', cols: 2, rows: 1, color: this.getTileAccess(this.profile.access.two, 'Two')},
        //   {text: '', cols: 4, rows: 6, color: 'url(' + this.profile.photothumbnailurl + ')'},
        //   {text: '3', cols: 2, rows: 1, color: this.getTileAccess(this.profile.access.three, 'Three')},
        //   {text: '4', cols: 2, rows: 1, color: this.getTileAccess(this.profile.access.four, 'Four')},
        // ];
      });
  }

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
        return '#e6e6e6';
      default:
        return '#e6e6e6';
    }
  }

  // GET BACKGROUND COLOR

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

}
