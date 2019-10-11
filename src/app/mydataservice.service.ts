import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders  } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Profile, ProfileObj } from './profile';
import { Approvaltemplate } from './approvaltemplate';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class MydataserviceService {

  public userapprovaltemplate: Approvaltemplate;
  public find = 'Provisional';
  public distinction = 'OPEMPLOYEE';
  public usertype: string;
  public useroffice: string;
  public eventcode: string;
  public eventcreator: string;
  public nextstep = 100;
  public limit = 8; // limit must be atleast 8 and above
  public newestFirst = true;
  private api = '/api';
  public image_source = '-';

  constructor(private http: HttpClient) { }

  transformPBU(fullURL: any): any {
    let result: string;
    if (this.image_source === '-') {
      result = fullURL;
    } else {
      const img_src = this.image_source; // 'https@//example.com/'
      const new_img_src = img_src.replace('@', ':');
      const newUrl = fullURL.replace(/(https?:|)(^|\/\/)(.*?\/)/g, new_img_src);
      // example of supplying the hostname only without a protocol (http(s)://)
      // var OldText = "http://local.something.com:85/auth/signin";
      // var NewText = OldText.replace (/(https?:\/\/)(.*?)(:*)/g, '$1' + 'example.com' + '$3');
      result = newUrl;
    }
    return result;
  }

  getProfiles(page: number) {
    let _useroffice = this.useroffice;
    if (this.distinction.includes('EVENT')) {
      if (this.eventcreator !== undefined && this.eventcreator !== '') {
        _useroffice = this.eventcreator;
      }
      if (this.eventcode !== undefined && this.eventcode !== '') {
        _useroffice = this.eventcode;
      }
    }
    // tslint:disable-next-line:max-line-length
    const url = `${this.api}/profile/accessapprovals?findtext=${this.find}&distinction=${this.distinction}&nextstep=${this.nextstep}&useroffice=${_useroffice}&page=${page}&limit=${this.limit}&newestfirst=${this.newestFirst}`;
    return this.http.get(url);
  }

  getApprovalTemplate() {
    this.nextstep = 100;
    const body = {
      distinction: this.distinction,
      usertype: this.usertype
    };
    const approvaltemplateurl = `${this.api}/approvaltemplate`;
    const approvaltemplate: any = this.http.post<any>(approvaltemplateurl, body);
    if (approvaltemplate !== null) {
      return approvaltemplate;
    }
  }

  // findapprovaltemplates API
  getTemplates(distinction: String, page: number) {
    // tslint:disable-next-line:max-line-length
    const url = `${this.api}/findapprovaltemplates?distinction=${distinction}&page=${page}&limit=10`;
    return this.http.get(url);
  }

  saveProfile(profile: Profile) {
    const url = `${this.api}/profile`;
    return this.http.post(url, new ProfileObj(profile));
  }

  // push status data to vegas
  async issueEventApproval(code: String, status: String) {
    const base_url = 'http://58.69.10.200/guests/updateStatus';
    const body = {
      code: code,
      status: status
    };
    const url = `${base_url}`;
    const data: any = await
    this.http.post(url, body,
      httpOptions).toPromise();
   return data;
  }

  createFreezedProfile(p: Profile): Profile {

    // deconstruct then set to this.profile
    const {
      _id,
      profileid,
      mobile,
      email,
      name,
      distinction,
      personaccesslevel,
      recordstatus,
      cisscode,
      cissinqtext,
      cisstoken,
      rfid,
      photothumbnailurl,
      employee,
      resident,
      visitor,
      event,
      datecreated,
      dateupdated,
      two_factor_temp_secret,
      two_factor_secret,
      two_factor_enabled,
      score,
      access,
      proviaccess,
      gender,
      nextstep,
      accessapproval,
      accessdatetagged,
      blacklisted,
    } = p;

    const profile: Profile = <Profile> Object.freeze({
      _id: _id,
      profileid: profileid,
      mobile: mobile,
      email: email,
      name: Object.freeze({
        first: name.first,
        middle: name.middle,
        last: name.last
      }),
      distinction: distinction,
      personaccesslevel: personaccesslevel,
      recordstatus: recordstatus,
      cisscode: cisscode,
      cissinqtext: cissinqtext,
      cisstoken: cisstoken,
      rfid: rfid,
      photothumbnailurl: photothumbnailurl,
      employee: employee !== undefined ? Object.freeze({
        position: employee.position,
        office: employee.office
      }) : {},
      resident: resident !== undefined ? Object.freeze({
        city: resident.city,
        district: resident.district,
        barangay: resident.barangay
      }) : {},
      visitor: visitor !== undefined ? Object.freeze({
        visitorid: visitor.visitorid,
        visitorcompany: visitor.visitorcompany,
        persontovisit: visitor.persontovisit,
        visitorpurpose: visitor.visitorpurpose,
        visitordestination: visitor.visitordestination,
        timeofappointment: visitor.timeofappointment,
        visitstatus: visitor.visitstatus
      }) : {},
      event: event !== undefined ? Object.freeze({
        eventcode: event.eventcode,
        guestaffiliation: event.guestaffiliation,
        eventid: event.eventid,
        eventname: event.eventname,
        eventdetails: event.eventdetails,
        eventcreator: event.eventcreator,
        timeofevent: event.timeofevent
      }) : {},
      datecreated: datecreated,
      dateupdated: dateupdated,
      two_factor_temp_secret: two_factor_temp_secret,
      two_factor_secret: two_factor_secret,
      two_factor_enabled: two_factor_enabled,
      score: score,
      access: Object.freeze({
        one: access.one,
        two: access.two,
        three: access.three,
        four: access.four,
        colorone: access.colorone,
        colortwo: access.colortwo,
        colorthree: access.colorthree,
        colorfour: access.colorfour
      }),
      proviaccess: Object.freeze({
        one: proviaccess.one,
        two: proviaccess.two,
        three: proviaccess.three,
        four: proviaccess.four,
        colorone: proviaccess.colorone,
        colortwo: proviaccess.colortwo,
        colorthree: proviaccess.colorthree,
        colorfour: proviaccess.colorfour
      }),
      gender: gender,
      nextstep: nextstep,
      accessapproval: accessapproval,
      accessdatetagged: accessdatetagged,
      blacklisted: blacklisted
    });
    return profile;
  }

  unfreezeProfile(p: Profile): Profile {

    // deconstruct then set to this.profile
    const {
      _id,
      profileid,
      mobile,
      email,
      name,
      distinction,
      personaccesslevel,
      recordstatus,
      cisscode,
      cissinqtext,
      cisstoken,
      rfid,
      photothumbnailurl,
      employee,
      resident,
      visitor,
      event,
      datecreated,
      dateupdated,
      two_factor_temp_secret,
      two_factor_secret,
      two_factor_enabled,
      score,
      access,
      proviaccess,
      gender,
      nextstep,
      accessapproval,
      accessdatetagged,
      blacklisted,
    } = p;

    const profile: Profile = <Profile> {
      _id: _id,
      profileid: profileid,
      mobile: mobile,
      email: email,
      name: {
        first: name.first,
        middle: name.middle,
        last: name.last
      },
      distinction: distinction,
      personaccesslevel: personaccesslevel,
      recordstatus: recordstatus,
      cisscode: cisscode,
      cissinqtext: cissinqtext,
      cisstoken: cisstoken,
      rfid: rfid,
      photothumbnailurl: photothumbnailurl,
      employee: employee !== undefined ? {
        position: employee.position,
        office: employee.office
      } : {},
      resident: resident !== undefined ? {
        city: resident.city,
        district: resident.district,
        barangay: resident.barangay
      } : {},
      visitor: visitor !== undefined ? {
        visitorid: visitor.visitorid,
        visitorcompany: visitor.visitorcompany,
        persontovisit: visitor.persontovisit,
        visitorpurpose: visitor.visitorpurpose,
        visitordestination: visitor.visitordestination,
        timeofappointment: visitor.timeofappointment,
        visitstatus: visitor.visitstatus
      } : {},
      event: event !== undefined ? Object.freeze({
        eventcode: event.eventcode,
        guestaffiliation: event.guestaffiliation,
        eventid: event.eventid,
        eventname: event.eventname,
        eventdetails: event.eventdetails,
        eventcreator: event.eventcreator,
        timeofevent: event.timeofevent
      }) : {},
      datecreated: datecreated,
      dateupdated: dateupdated,
      two_factor_temp_secret: two_factor_temp_secret,
      two_factor_secret: two_factor_secret,
      two_factor_enabled: two_factor_enabled,
      score: score,
      access: {
        one: access.one,
        two: access.two,
        three: access.three,
        four: access.four,
        colorone: access.colorone,
        colortwo: access.colortwo,
        colorthree: access.colorthree,
        colorfour: access.colorfour
      },
      proviaccess: {
        one: proviaccess.one,
        two: proviaccess.two,
        three: proviaccess.three,
        four: proviaccess.four,
        colorone: proviaccess.colorone,
        colortwo: proviaccess.colortwo,
        colorthree: proviaccess.colorthree,
        colorfour: proviaccess.colorfour
      },
      gender: gender,
      nextstep: nextstep,
      accessapproval: accessapproval,
      accessdatetagged: accessdatetagged,
      blacklisted: blacklisted
    };
    return profile;
  }

}
