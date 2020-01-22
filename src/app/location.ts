export interface Location {
  _id: string;
  id: String;
  name: String;
  datecreated: Date;
}

export class LocationObj implements Location {
  _id: string;
  id: String;
  name: String;
  datecreated: Date;

  constructor(item?: Location) {
      if (item !== undefined) {
          // tslint:disable-next-line:forin
          for (const key in item) {
              try { this[key] = item[key]; } catch (e) { }
          }
      }
  }
}
