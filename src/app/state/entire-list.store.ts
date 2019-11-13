import { Injectable } from '@angular/core';
import { EntireListItem } from './entire-list.model';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

export interface EntireListState extends EntityState<EntireListItem> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'entire-list' })
export class EntireListStore extends EntityStore<EntireListState, EntireListItem> {

  constructor() {
    super();
  }

}

