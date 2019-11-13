import { guid, ID } from '@datorama/akita';

export interface EntireListItem {
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

export function createEntireListItem({
  profileid,
  name,
  gender,
  imagepath,
  distinction,
  gate,
  qrcode
}: Partial<EntireListItem>) {
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
  } as EntireListItem;
}
