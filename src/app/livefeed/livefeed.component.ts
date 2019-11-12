import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  ChangeDetectorRef,
  NgZone
} from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { LivefeedListService } from '../state/livefeed-list.service';
import { Observable } from 'rxjs';
import { LivefeedListQuery } from '../state/livefeed-list.query';
import { ID } from '@datorama/akita';
import { LivefeedListItem } from '../state/livefeed-list.model';

import { MydataserviceService } from '../mydataservice.service';

import {
  style, animate, animation, animateChild,
  useAnimation, group, sequence, transition,
  state, trigger, query, stagger
} from '@angular/animations';
// const query = (s, a, o = { optional: true }) => q(s, a, o);

@Component({
  selector: 'app-livefeed',
  templateUrl: './livefeed.component.html',
  animations: [
    // nice stagger effect when showing existing elements
    trigger('list', [
      transition(':enter', [
        // child animation selector + stagger
        query('@items',
          stagger(300, animateChild())
        )
      ]),
    ]),
    trigger('items', [
      // cubic-bezier for a tiny bouncing feel
      transition(':enter', [
        style({ transform: 'scale(0.5)', opacity: 0 }),
        animate('1s cubic-bezier(.8,-0.6,0.2,1.5)',
          style({ transform: 'scale(1)', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'scale(1)', opacity: 1, height: '*' }),
        animate('1s cubic-bezier(.8,-0.6,0.2,1.5)',
          style({ transform: 'scale(0.5)', opacity: 0, height: '0px', margin: '0px' }))
      ]),
    ])
  ],
  styleUrls: ['./livefeed.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LivefeedComponent implements OnInit, OnDestroy {

  userType$: Observable<string>;

  counter = 5;
  list = [1, 2, 3, 4];

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

  items$: Observable<LivefeedListItem[]>;
  private disposeConnection: VoidFunction;

  constructor(public livefeedList: LivefeedListService,
    public query: LivefeedListQuery,
    public service: MydataserviceService,
    private authService: AuthService,
    private ref: ChangeDetectorRef,
    private zone: NgZone) {
  }

  async ngOnInit() {
    this.items$ = this.query.selectAll();
    this.disposeConnection = await this.livefeedList.connect();
    // this.service.hasSearch = false;
    this.userType$ = this.authService.userType; // {2}
    setInterval(() => {
      this.ref.detectChanges();
      this.ref.markForCheck();
      this.zone.run(() => {
        // Here add the code to force the value update
        this.userType$ = this.authService.userType; // This value will be force updated
      });
    }, 3000);
  }

  feed(input: HTMLInputElement) {
    // this.livefeedList.feed(input.value);
    // input.value = '';
  }

  add(input: HTMLInputElement) {
    this.livefeedList.add(input.value);
    input.value = '';
  }

  remove(id: ID) {
    this.livefeedList.remove(id);
  }

  toggle(id: ID) {
    this.livefeedList.toggleCompleted(id);
  }

  track(_, item) {
    return item.name;
  }

  ngOnDestroy() {
    this.disposeConnection();
  }

  old_add() {
    this.list.unshift(this.counter++);
    if (this.list.length < 6) return;
    this.list.pop();
  }

  old_remove(index) {
    if (!this.list.length) return;
    // this.list.splice(index,1);
    this.list.pop();
  }

  OnMatCardClickEvent(item: any): void {
    // // On approval component mat card click, add checks if
    // // distinction includes EVENT
    // // then if user is the owner of the event OR
    // // if user eventcreator value is 'SA'
    // let openD = true;
    // const _profile: Profile = <Profile>item;
    // if (_profile.distinction.includes('EVENT')) {
    //   openD = false;
    //   if (this.service.eventcreator === _profile.event.eventcreator ||
    //     this.service.eventcreator === 'SA') {
    //     openD = true;
    //   }
    // }
    // if (openD === true) {
    //   this.profile = <Profile>item;
    //   this.openDialog();
    // }
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