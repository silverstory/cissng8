export interface NotifyGroup {
  _id: string;
  distinction: String;
  usertype: String;
  username: String;
  mobile: String;
  message: String;
  datemodified: Date;
}

export class NotifyGroupObj implements NotifyGroup {
  _id: string;
  distinction: String;
  usertype: String;
  username: String;
  mobile: String;
  message: String;
  datemodified: Date;

  constructor(item?: NotifyGroup) {
      if (item !== undefined) {
          // tslint:disable-next-line:forin
          for (const key in item) {
              try { this[key] = item[key]; } catch (e) { }
          }
      }
  }
}
