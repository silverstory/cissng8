export interface Notification {
  _id: string;
  distinction: String;
  usertype: String;
  username: String;
  mobile: String;
  message: String;
  datetimesent: Date;
}

export class NotificationObj implements Notification {
  _id: string;
  distinction: String;
  usertype: String;
  username: String;
  mobile: String;
  message: String;
  datetimesent: Date;

  constructor(item?: Notification) {
      if (item !== undefined) {
          // tslint:disable-next-line:forin
          for (const key in item) {
              try { this[key] = item[key]; } catch (e) { }
          }
      }
  }
}
