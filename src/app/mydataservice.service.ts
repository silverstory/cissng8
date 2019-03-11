import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders  } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Profile, ProfileObj } from './profile';
import { Approvaltemplate } from './approvaltemplate';

@Injectable({
  providedIn: 'root'
})
export class MydataserviceService {

  public userapprovaltemplate: Approvaltemplate;
  public find = 'Provisional';
  public distinction = 'OPEMPLOYEE';
  public usertype: string;
  public useroffice: string;
  public nextstep = 100;
  public limit = 8; // limit must be atleast 8 and above
  public newestFirst = true;
  private api = '/api';

  constructor(private http: HttpClient) { }

  getProfiles(page: number) {
    // tslint:disable-next-line:max-line-length
    const url = `${this.api}/profile/accessapprovals?findtext=${this.find}&distinction=${this.distinction}&nextstep=${this.nextstep}&useroffice=${this.useroffice}&page=${page}&limit=${this.limit}&newestfirst=${this.newestFirst}`;
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

  // para sa badges
  getProfilesforBadges(findtext: String, distinction: String, nextstep: number, useroffice: String) {
    // tslint:disable-next-line:max-line-length
    const url = `${this.api}/profile/accessapprovals?findtext=${findtext}&distinction=${distinction}&nextstep=${nextstep}&useroffice=${useroffice}&page=1&limit=1&newestfirst=${this.newestFirst}`;
    return this.http.get(url);
  }

  getApprovalTemplateforBadges(distinction: String, usertype: String) {
    const body = {
      distinction: distinction,
      usertype: usertype
    };
    const approvaltemplateurl = `${this.api}/approvaltemplate`;
    const approvaltemplate: any = this.http.post<any>(approvaltemplateurl, body);
    if (approvaltemplate !== null) {
      return approvaltemplate;
    }
  }
  // end para sa badges

}
