import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { EntireListStore, EntireListState } from './entire-list.store';
import { EntireListItem } from './entire-list.model';
  import { from } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EntireListQuery extends QueryEntity<EntireListState, EntireListItem> {

  constructor(protected store: EntireListStore) {
    super(store);
  }

}
