import { Component, OnInit } from '@angular/core';

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
  styleUrls: ['./livefeed.component.css']
})
export class LivefeedComponent implements OnInit {

  counter = 5;
  list = [1, 2, 3, 4];

  constructor() { }

  ngOnInit() {
  }

  add() {
    this.list.unshift(this.counter++);
    if (this.list.length < 6) return;
    this.list.pop();
  }

  remove(index) {
    if (!this.list.length) return;
    // this.list.splice(index,1);
    this.list.pop();
  }

}
