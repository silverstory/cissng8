export interface ProfileAction {
  _id: string;
  profileid: String;
  mobile: String;
  email: String;
  name: {
    first: String;
    middle: String;
    last: String;
  };
  distinction: String;
  personaccesslevel: String;
  recordstatus: String;
  cisscode: String;
  cissinqtext: String;
  cisstoken: String;
  rfid: String;
  photothumbnailurl: String;
  employee: {
    position: String;
    office: String;
  };
  resident: {
    city: String;
    district: String;
    barangay: String;
  };
  visitor: {
    visitorid: String;
    visitorcompany: String;
    persontovisit: String;
    visitorpurpose: String;
    visitordestination: String;
    timeofappointment: Date;
    visitstatus: String;
  };
  event: {
    eventcode: String;
    guestaffiliation: String;
    eventid: String;
    eventname: String;
    eventdetails: String;
    eventcreator: String;
    timeofevent: Date;
  };
  datecreated: Date;
  dateupdated: Date;
  two_factor_temp_secret: String;
  two_factor_secret: String;
  two_factor_enabled: Boolean;
  score: number;
  access: {
    one: String;
    two: String;
    three: String;
    four: String;
    colorone: String;
    colortwo: String;
    colorthree: String;
    colorfour: String;
  };
  proviaccess: {
    one: String;
    two: String;
    three: String;
    four: String;
    colorone: String;
    colortwo: String;
    colorthree: String;
    colorfour: String;
  };
  gender: String;
  nextstep: number;
  accessapproval: String;
  accessdatetagged: Date;
  blacklisted: Boolean;
  action: {
    user: String;
    response: String;
    datetime: Date;
  };
}

export class ProfileActionObj implements ProfileAction {
  _id: string;
  profileid: String;
  mobile: String;
  email: String;
  name: {
    first: String;
    middle: String;
    last: String;
  };
  distinction: String;
  personaccesslevel: String;
  recordstatus: String;
  cisscode: String;
  cissinqtext: String;
  cisstoken: String;
  rfid: String;
  photothumbnailurl: String;
  employee: {
    position: String;
    office: String;
  };
  resident: {
    city: String;
    district: String;
    barangay: String;
  };
  visitor: {
    visitorid: String;
    visitorcompany: String;
    persontovisit: String;
    visitorpurpose: String;
    visitordestination: String;
    timeofappointment: Date;
    visitstatus: String;
  };
  event: {
    eventcode: String;
    guestaffiliation: String;
    eventid: String;
    eventname: String;
    eventdetails: String;
    eventcreator: String;
    timeofevent: Date;
  };
  datecreated: Date;
  dateupdated: Date;
  two_factor_temp_secret: String;
  two_factor_secret: String;
  two_factor_enabled: Boolean;
  score: number;
  access: {
    one: String;
    two: String;
    three: String;
    four: String;
    colorone: String;
    colortwo: String;
    colorthree: String;
    colorfour: String;
  };
  proviaccess: {
    one: String;
    two: String;
    three: String;
    four: String;
    colorone: String;
    colortwo: String;
    colorthree: String;
    colorfour: String;
  };
  gender: String;
  nextstep: number;
  accessapproval: String;
  accessdatetagged: Date;
  blacklisted: Boolean;
  action: {
    user: String;
    response: String;
    datetime: Date;
  };

  constructor(item?: ProfileAction) {
      if (item !== undefined) {
          // tslint:disable-next-line:forin
          for (const key in item) {
              try { this[key] = item[key]; } catch (e) { }
          }
      }
  }
}
