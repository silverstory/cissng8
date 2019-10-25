export interface Distinction {
  _id: string;
  id: number;
  name: String;
  alias: String;
  chipcolor: String;
  default_color: String;
  badge: number;
  badgehidden: Boolean;
  badgecolor: String;
  badgesize: String;
  canreceivesms: String;
  datecreated: Date;
}

export class DistinctionObj implements Distinction {
  _id: string;
  id: number;
  name: String;
  alias: String;
  chipcolor: String;
  default_color: String;
  badge: number;
  badgehidden: Boolean;
  badgecolor: String;
  badgesize: String;
  canreceivesms: String;
  datecreated: Date;

  constructor(item?: Distinction) {
      if (item !== undefined) {
          // tslint:disable-next-line:forin
          for (const key in item) {
              try { this[key] = item[key]; } catch (e) { }
          }
      }
  }
}
