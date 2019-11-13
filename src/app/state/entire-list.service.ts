import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { ID, runStoreAction, StoreActions } from '@datorama/akita';
import { EntireListStore } from './entire-list.store';
import { createEntireListItem, EntireListItem } from './entire-list.model';
import { MydataserviceService } from '../mydataservice.service';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

const resolveAction = {
  ADD: StoreActions.AddEntities,
  REMOVE: StoreActions.RemoveEntities,
  SET: StoreActions.SetEntities,
  UPDATE: StoreActions.UpdateEntities
};

@Injectable({ providedIn: 'root' })
export class EntireListService {
  private socket;

  constructor(private store: EntireListStore,
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

    this.socket.on('entirelist', event => {
      runStoreAction(this.store.storeName, resolveAction[event.type], {
        payload: {
          entityIds: event.ids,
          data: event.data
        }
      });
    });

    return () => this.socket.disconnect();
  }

  add(
    profileid: string,
    name: string,
    gender: string,
    imagepath: string,
    distinction: string,
    gate: string,
    qrcode: string
  ) {
    this.socket.emit('entirelist:add', createEntireListItem({
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

  remove(id: ID) {
    this.socket.emit('entirelist:remove', id);
  }

  toggleCompleted(id: ID) {
    this.socket.emit('entirelist:toggle', id);
  }

}
