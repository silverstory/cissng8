import { guid, ID } from '@datorama/akita';

export interface LivefeedListItem {
  id: ID;
  // title: string;
  profileid: string;
  name: string;
  gender: string;
  imagepath: string;
  distinction: string;
  gate: string;
  qrcode: string;
  completed: boolean;
}

export function createLivefeedListItem({
  profileid,
  name,
  gender,
  imagepath,
  distinction,
  gate,
  qrcode
}: Partial<LivefeedListItem>) {
  return {
    id: guid(),
    profileid: profileid,
    // tslint:disable-next-line: object-literal-shorthand
    name: name,
    gender: gender,
    imagepath: imagepath,
    distinction: distinction,
    gate: gate,
    qrcode: qrcode,
    completed: false,
  } as LivefeedListItem;
}
