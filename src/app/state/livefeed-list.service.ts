import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { LivefeedListStore } from './livefeed-list.store';
import { ID, runStoreAction, StoreActions } from '@datorama/akita';
import { createLivefeedListItem, LivefeedListItem } from './livefeed-list.model';
import { MydataserviceService } from '../mydataservice.service';
import { HttpClient } from '@angular/common/http';

const resolveAction = {
  ADD: StoreActions.AddEntities,
  REMOVE: StoreActions.RemoveEntities,
  SET: StoreActions.SetEntities,
  UPDATE: StoreActions.UpdateEntities
};

@Injectable({ providedIn: 'root' })
export class LivefeedListService {
  private socket;

  constructor(private store: LivefeedListStore,
    private http: HttpClient,
    public service: MydataserviceService) {
  }

  async connect() {

    // set socket ip
    const surl = await '/api/sip';
    const socket_ip: any = await this.http.get(surl).toPromise();
    const true_socket: any = socket_ip.socket_ip;
    this.service.socket_ip = true_socket;

    this.socket = io.connect(`http://${this.service.socket_ip}:8000`);

    this.socket.on('list', event => {
      runStoreAction(this.store.storeName, resolveAction[event.type], {
        payload: {
          entityIds: event.ids,
          data: event.data
        }
      });
    });

    return () => this.socket.disconnect();
  }

  old_feed(name: string) {
    // this.socket.emit('list:feed', createLivefeedListItem({ name }));
  }

  feed(
    profileid: string,
    name: string,
    gender: string,
    imagepath: string,
    distinction: string,
    gate: string,
    qrcode: string
  ) {
    this.socket.emit('list:feed', createLivefeedListItem({
      profileid,
      name,
      gender,
      imagepath,
      distinction,
      gate,
      qrcode
    })
    );
  }

  add(name: string) {
    // this.socket.emit('list:add', createLivefeedListItem({ name }));
  }

  remove(id: ID) {
    this.socket.emit('list:remove', id);
  }

  toggleCompleted(id: ID) {
    this.socket.emit('list:toggle', id);
  }
}
