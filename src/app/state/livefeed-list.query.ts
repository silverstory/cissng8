import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { LivefeedListStore, LivefeedListState } from './livefeed-list.store';
import { LivefeedListItem } from './livefeed-list.model';

@Injectable({ providedIn: 'root' })
export class LivefeedListQuery extends QueryEntity<LivefeedListState, LivefeedListItem> {

  constructor(protected store: LivefeedListStore) {
    super(store);
  }

}
